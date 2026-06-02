const express = require('express');
const router = express.Router();
const Fleet = require('../models/Fleet');

// Get all fleet private jets
router.get('/', async (req, res) => {
  try {
    const jets = await Fleet.find();
    res.json(jets);
  } catch (error) {
    console.error('Fetch jets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
