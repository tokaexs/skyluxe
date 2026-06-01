const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Get concierge services
router.get('/services', (req, res) => {
  const services = {
    travelPlanning: {
      name: 'Travel Planning',
      description: 'Comprehensive travel planning and coordination',
      features: [
        'Custom itineraries',
        'Visa assistance',
        'Travel insurance',
        'Local guides'
      ]
    },
    hotelAccommodation: {
      name: 'Hotel & Accommodation',
      description: 'Luxury hotel bookings and special arrangements',
      features: [
        '5-star hotel bookings',
        'Room upgrades',
        'Special amenities',
        'Early check-in/late check-out'
      ]
    },
    diningEntertainment: {
      name: 'Dining & Entertainment',
      description: 'Exclusive dining and entertainment experiences',
      features: [
        'Restaurant reservations',
        'Private dining',
        'Event tickets',
        'Local experiences'
      ]
    }
  };
  res.json(services);
});

// Submit concierge request
router.post('/request',
  [
    body('service').isIn(['travelPlanning', 'hotelAccommodation', 'diningEntertainment'])
      .withMessage('Invalid service type'),
    body('details').notEmpty().withMessage('Request details are required'),
    body('preferredDate').isISO8601().withMessage('Valid date is required'),
    body('budget').optional().isNumeric().withMessage('Budget must be a number')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.userId;
      const { service, details, preferredDate, budget } = req.body;

      // Check if user has Platinum membership
      const user = await User.findById(userId);
      if (!user || user.membership !== 'platinum') {
        return res.status(403).json({ 
          message: 'Concierge service is only available for Platinum members' 
        });
      }

      // Here you would typically:
      // 1. Create a concierge request in the database
      // 2. Send notification to concierge team
      // 3. Send confirmation to user

      // For now, we'll just return a success response
      res.status(201).json({
        message: 'Concierge request submitted successfully',
        requestId: Date.now().toString(), // This would be replaced with actual request ID
        service,
        details,
        preferredDate,
        budget,
        status: 'pending'
      });
    } catch (error) {
      console.error('Concierge request error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's concierge requests
router.get('/requests', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Here you would typically:
    // 1. Query the database for user's concierge requests
    // 2. Return the requests with their status

    // For now, we'll return a mock response
    res.json({
      requests: [
        {
          id: '1',
          service: 'travelPlanning',
          details: 'Planning a trip to Europe',
          preferredDate: '2024-06-01',
          status: 'completed'
        },
        {
          id: '2',
          service: 'hotelAccommodation',
          details: 'Booking luxury hotel in Paris',
          preferredDate: '2024-06-15',
          status: 'pending'
        }
      ]
    });
  } catch (error) {
    console.error('Get concierge requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel concierge request
router.post('/requests/:id/cancel', async (req, res) => {
  try {
    const userId = req.user.userId;
    const requestId = req.params.id;

    // Here you would typically:
    // 1. Find the request in the database
    // 2. Verify the request belongs to the user
    // 3. Update the request status to cancelled
    // 4. Send notification to concierge team

    // For now, we'll just return a success response
    res.json({
      message: 'Concierge request cancelled successfully',
      requestId,
      status: 'cancelled'
    });
  } catch (error) {
    console.error('Cancel concierge request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 