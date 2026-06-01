const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Get membership tiers
router.get('/tiers', (req, res) => {
  const tiers = {
    silver: {
      name: 'Silver',
      price: 999,
      benefits: [
        'Priority check-in',
        'Lounge access',
        '10% off on flights',
        '500 bonus points'
      ]
    },
    gold: {
      name: 'Gold',
      price: 1999,
      benefits: [
        'All Silver benefits',
        'Business class upgrades',
        '20% off on flights',
        '1000 bonus points',
        'Free airport transfers'
      ]
    },
    platinum: {
      name: 'Platinum',
      price: 3999,
      benefits: [
        'All Gold benefits',
        'First class upgrades',
        '30% off on flights',
        '2000 bonus points',
        'Free airport transfers',
        'Personal concierge service'
      ]
    }
  };
  res.json(tiers);
});

// Purchase membership
router.post('/purchase',
  [
    body('tier').isIn(['silver', 'gold', 'platinum']).withMessage('Invalid membership tier'),
    body('paymentMethod').isIn(['credit_card', 'debit_card', 'net_banking']).withMessage('Invalid payment method')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tier, paymentMethod } = req.body;
      const userId = req.user.userId;

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get tier details
      const tiers = {
        silver: { price: 999, points: 500 },
        gold: { price: 1999, points: 1000 },
        platinum: { price: 3999, points: 2000 }
      };

      const tierDetails = tiers[tier];

      // Update user membership
      user.membership = tier;
      user.membershipExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      user.points += tierDetails.points;

      await user.save();

      res.json({
        message: 'Membership purchased successfully',
        membership: user.membership,
        expiry: user.membershipExpiry,
        points: user.points
      });
    } catch (error) {
      console.error('Membership purchase error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's membership details
router.get('/details', async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('membership membershipExpiry points');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Membership details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Renew membership
router.post('/renew', async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.membership) {
      return res.status(400).json({ message: 'No active membership to renew' });
    }

    // Get tier details
    const tiers = {
      silver: { price: 999, points: 500 },
      gold: { price: 1999, points: 1000 },
      platinum: { price: 3999, points: 2000 }
    };

    const tierDetails = tiers[user.membership];

    // Update membership expiry and add bonus points
    user.membershipExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    user.points += tierDetails.points;

    await user.save();

    res.json({
      message: 'Membership renewed successfully',
      expiry: user.membershipExpiry,
      points: user.points
    });
  } catch (error) {
    console.error('Membership renewal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 