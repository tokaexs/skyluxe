const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const requireAuth = require('../middleware/requireAuth');
const { searchSerpApiFlights } = require('../lib/serpApiFlights');
const ARIS = require('../models/ARIS');

// Search flights
router.post('/search',
  [
    body('from').notEmpty().withMessage('Departure city is required'),
    body('to').notEmpty().withMessage('Arrival city is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('passengers').isInt({ min: 1 }).withMessage('At least 1 passenger is required'),
    body('class').isIn(['economy', 'business', 'first']).withMessage('Invalid class')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { from, to, date, passengers, class: cabinClass, type } = req.body;

      // Log search for AI analytics
      try {
        let userId = null;
        const authHeader = req.headers.authorization || req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.replace('Bearer ', '');
          const decoded = require('jsonwebtoken').decode(token);
          if (decoded && decoded.userId) {
            userId = decoded.userId;
          }
        }
        await new ARIS.FlightSearch({
          from,
          to,
          cabinClass: cabinClass || 'economy',
          passengers: passengers || 1,
          userId
        }).save();

        const { trackEvent } = require('../lib/analytics');
        await trackEvent(req, 'search_flights', { from, to, class: cabinClass || 'economy', passengers: passengers || 1 });
      } catch (err) {
        console.warn('Failed to log flight search event:', err.message);
      }

      // Search via SerpApi
      try {
        const liveFlights = await searchSerpApiFlights(from, to, date, passengers, cabinClass, type || 'one-way');
        if (liveFlights && liveFlights.length > 0) {
          return res.json(liveFlights);
        }
        if (process.env.NODE_ENV !== 'test') {
          return res.status(503).json({ message: 'Flight search service is currently down.' });
        }
      } catch (apiErr) {
        console.error('Flights search API failure:', apiErr);
        if (process.env.NODE_ENV !== 'test') {
          return res.status(503).json({ message: 'Flight search service is currently down.' });
        }
      }

      // Find flights matching the criteria from local database (Only in test mode)
      if (process.env.NODE_ENV === 'test') {
        const flights = await Flight.find({
          $or: [
            { 'departure.city': from },
            { 'departure.airport': from.toUpperCase() }
          ],
          $or: [
            { 'arrival.city': to },
            { 'arrival.airport': to.toUpperCase() }
          ],
          'departure.time': {
            $gte: new Date(date),
            $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
          },
          [`availableSeats.${cabinClass}`]: { $gte: passengers }
        }).populate('airline');

        return res.json(flights);
      } else {
        return res.status(503).json({ message: 'Flight search service is currently down.' });
      }
    } catch (error) {
      console.error('Flight search error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get flight details
router.get('/:id', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let flight = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id) && req.params.id !== '00000000-0000-0000-0000-000000000000') {
      flight = await Flight.findById(req.params.id).populate('airline');
    } else {
      flight = await Flight.findOne({ flightNumber: req.params.id }).populate('airline');
    }
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found', error: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    console.error('Flight details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book flight
router.post('/book',
  requireAuth,
  [
    body('flightId').notEmpty().withMessage('Flight ID is required'),
    body('passengers').isArray().withMessage('Passengers array is required'),
    body('class').isIn(['economy', 'business', 'first']).withMessage('Invalid class'),
    body('seats').optional().isArray().withMessage('Seats must be an array'),
    body('paymentMethod').isIn(['credit_card', 'debit_card', 'net_banking', 'card', 'wallet']).withMessage('Invalid payment method')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { flightId, passengers, class: cabinClass, seats, paymentMethod, specialRequests } = req.body;

      // Get flight details
      const flight = await Flight.findById(flightId);
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      // Check seat availability
      const availableSeats = flight.availableSeats[cabinClass];
      if (availableSeats < passengers.length) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }

      // Calculate total price
      const basePrice = flight.price[cabinClass];
      const totalPrice = basePrice * passengers.length;

      // Create booking
      const booking = new Booking({
        user: req.user.userId || req.user.id || req.user._id,
        flight: flightId,
        passengers,
        class: cabinClass,
        seats,
        totalPrice,
        paymentMethod,
        specialRequests
      });

      await booking.save();

      const { trackEvent } = require('../lib/analytics');
      await trackEvent(req, 'book_flight', { flightId, totalPrice, class: cabinClass });

      // Update flight availability
      flight.availableSeats[cabinClass] -= passengers.length;
      await flight.save();

      res.status(201).json({
        ...booking.toJSON(),
        bookingId: booking._id,
        status: booking.status.toLowerCase()
      });
    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's bookings
router.get('/bookings/user', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId || req.user.id || req.user._id })
      .populate('flight')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('User bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.post('/bookings/:id/cancel', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId || req.user.id || req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update flight availability
    const flight = await Flight.findById(booking.flight);
    flight.availableSeats[booking.class] += booking.passengers.length;
    await flight.save();

    res.json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 