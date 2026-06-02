const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ConciergeRequest = require('../models/ConciergeRequest');

// Get all concierge requests for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const requests = await ConciergeRequest.find({ user: userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Fetch concierge requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new concierge request
router.post('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const { type, details } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!type || !details) {
      return res.status(400).json({ message: 'Type and details are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const request = new ConciergeRequest({
      user: user._id,
      type,
      details,
      status: 'Pending'
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    console.error('Create concierge request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Legacy support routes
router.get('/requests', async (req, res) => {
  try {
    const userId = req.query.user_id || (req.user && req.user.userId);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const requests = await ConciergeRequest.find({ user: userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Legacy fetch requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/request', async (req, res) => {
  try {
    const userId = req.query.user_id || (req.user && req.user.userId);
    const { service, details } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Map service to standard type
    let type = 'Travel Planning';
    if (service === 'hotelAccommodation') type = 'Hotel Booking';
    if (service === 'diningEntertainment') type = 'Private Chef';

    const request = new ConciergeRequest({
      user: userId,
      type,
      details,
      status: 'Pending'
    });

    await request.save();
    res.status(201).json({
      message: 'Concierge request submitted successfully',
      requestId: request._id,
      service,
      details,
      status: 'pending'
    });
  } catch (error) {
    console.error('Legacy request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;