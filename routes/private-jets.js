const express = require('express');
const router = express.Router();
const PrivateJet = require('../models/PrivateJet');
const CharterRequest = require('../models/CharterRequest');
const requireAuth = require('../middleware/requireAuth');

router.get('/', async (req, res) => {
  try {
    const jets = await PrivateJet.find();
    res.json(jets);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const jet = await PrivateJet.findById(req.params.id);
    if (!jet) return res.status(404).json({ error: 'Jet not found' });
    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'view_jet', { jetId: req.params.id });
    res.json(jet);
  } catch (err) {
    res.status(404).json({ error: 'Jet not found' });
  }
});

router.post('/charter', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const { jetId, departure, arrival, passengers, specialRequests, paymentMethod } = req.body;
    
    const jet = await PrivateJet.findById(jetId);
    if (!jet) return res.status(404).json({ error: 'Jet not found' });
    
    const request = new CharterRequest({
      user: userId,
      jetId,
      departure,
      arrival,
      passengers,
      specialRequests,
      paymentMethod
    });
    
    await request.save();
    
    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'charter_request', { jetId, departure, arrival, passengers, paymentMethod });
    
    res.status(201).json({
      requestId: request._id,
      status: request.status,
      jetId: request.jetId
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/charter/requests', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const requests = await CharterRequest.find({ user: userId });
    res.json(requests.map(r => ({
      requestId: r._id,
      status: r.status,
      jetId: r.jetId
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/charter/requests/:id/cancel', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const request = await CharterRequest.findOne({ _id: req.params.id, user: userId });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    
    request.status = 'cancelled';
    await request.save();
    
    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'cancel_charter', { requestId: req.params.id });
    
    res.json({
      requestId: request._id,
      status: request.status
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
