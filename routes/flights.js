const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');

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

      const { from, to, date, passengers, class: cabinClass } = req.body;

      // Find flights matching the criteria
      const flights = await Flight.find({
        'departure.city': from,
        'arrival.city': to,
        'departure.time': {
          $gte: new Date(date),
          $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
        },
        [`availableSeats.${cabinClass}`]: { $gte: passengers }
      }).populate('airline');

      res.json(flights);
    } catch (error) {
      console.error('Flight search error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get flight details
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id).populate('airline');
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    console.error('Flight details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book flight
router.post('/book',
  [
    body('flightId').notEmpty().withMessage('Flight ID is required'),
    body('passengers').isArray().withMessage('Passengers array is required'),
    body('class').isIn(['economy', 'business', 'first']).withMessage('Invalid class'),
    body('seats').isArray().withMessage('Seats array is required'),
    body('paymentMethod').isIn(['credit_card', 'debit_card', 'net_banking']).withMessage('Invalid payment method')
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
        user: req.user.userId,
        flight: flightId,
        passengers,
        class: cabinClass,
        seats,
        totalPrice,
        paymentMethod,
        specialRequests
      });

      await booking.save();

      // Update flight availability
      flight.availableSeats[cabinClass] -= passengers.length;
      await flight.save();

      res.status(201).json(booking);
    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's bookings
router.get('/bookings/user', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('flight')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('User bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.post('/bookings/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId
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