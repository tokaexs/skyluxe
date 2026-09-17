const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ConciergeRequest = require('../models/ConciergeRequest');
const requireAuth = require('../middleware/requireAuth');

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

    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'concierge_request', { type, details });

    res.status(201).json(request);
  } catch (error) {
    console.error('Create concierge request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Services and Request routes supporting test cases and auth
const VALID_SERVICES = ['travel_planning', 'hotel_accommodation', 'dining_entertainment', 'ground_transport', 'airport_assistance', 'private_chef', 'private_security', 'helicopter_transfer'];

router.get('/services', (req, res) => {
  res.json([
    { name: 'Travel Planning', description: 'Need help planning a luxury vacation', price: 250 },
    { name: 'Hotel Accommodation', description: 'Luxury hotel booking', price: 150 },
    { name: 'Dining & Entertainment', description: 'Michelin restaurant bookings', price: 100 }
  ]);
});

router.post('/request', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const { service, details } = req.body;

    if (!service || !details) {
      return res.status(400).json({ error: 'Service and details are required' });
    }

    if (!VALID_SERVICES.includes(service)) {
      return res.status(400).json({ error: 'Invalid service' });
    }

    const request = new ConciergeRequest({
      user: userId,
      type: service,
      details,
      status: 'Pending'
    });

    await request.save();

    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'concierge_request', { type: service, details });

    res.status(201).json({
      requestId: request._id,
      status: 'pending',
      service: service
    });
  } catch (error) {
    console.error('Submit concierge request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/requests', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const requests = await ConciergeRequest.find({ user: userId }).sort({ createdAt: -1 });
    
    res.json(requests.map(r => ({
      requestId: r._id,
      status: r.status.toLowerCase(),
      service: r.type
    })));
  } catch (error) {
    console.error('Fetch concierge requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/requests/:id/cancel', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const request = await ConciergeRequest.findOne({ _id: req.params.id, user: userId });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'Cancelled';
    await request.save();

    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'cancel_concierge', { requestId: req.params.id });

    res.json({
      requestId: request._id,
      status: 'cancelled'
    });
  } catch (error) {
    console.error('Cancel concierge request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;