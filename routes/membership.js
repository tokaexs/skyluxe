const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');
const { generateMembershipCardPDF } = require('../lib/membershipCardGenerator');
const path = require('path');

// Download Membership Card PDF
router.get('/card/download', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pdfPath = await generateMembershipCardPDF(user);
    const absolutePath = path.join(__dirname, '..', pdfPath);
    
    res.download(absolutePath, `sovereign-card-${user._id}.pdf`);
  } catch (error) {
    console.error('Membership card PDF generation error:', error);
    res.status(500).json({ message: 'Server error generating membership card PDF' });
  }
});

const PLANS = [
  {
    id: 'silver',
    name: 'Silver',
    price: 999,
    benefits: [
      'Priority check-in',
      'VIP Lounge access',
      '10% off on commercial flights',
      '500 SkyCoins points bonus'
    ]
  },
  {
    id: 'executive',
    name: 'Executive',
    price: 9999,
    benefits: [
      'All Silver benefits included',
      'Complimentary business upgrades',
      '15% off on commercial flights',
      '2,500 SkyCoins points bonus',
      'Private helicopter terminal transfers'
    ]
  },
  {
    id: 'black_elite',
    name: 'Black Elite',
    price: 25000,
    benefits: [
      'All Executive benefits included',
      'First class seat upgrades',
      '25% off on commercial flights',
      '10,000 SkyCoins points bonus',
      'Personal 24/7 AI travel concierge',
      'Priority private charter dispatches'
    ]
  }
];

// Get membership plans
router.get('/', (req, res) => {
  res.json(PLANS);
});

// Subscribe to a membership plan
router.post('/subscribe', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const { plan_id } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!plan_id) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const plan = PLANS.find(p => p.id === plan_id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check FBO balance
    const cost = plan.price;
    const userBalance = user.wallet?.balance || 0;
    if (userBalance < cost) {
      return res.status(400).json({ message: `Insufficient FBO wallet funds. Required: $${cost}, Balance: $${userBalance}` });
    }

    // Deduct balance
    user.wallet.balance = userBalance - cost;

    // Set membership details
    user.membership = plan.id;
    user.membershipExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

    // Initialize passport and achievements stats if empty
    if (!user.passportStats) {
      user.passportStats = { countriesVisited: [], favoriteDestinations: [], stamps: [], flightsTaken: 0, privateJetHours: 0 };
    }
    
    // Give them a starting welcome achievement if they don't have it
    if (!user.achievements.includes('first_flight')) {
      user.achievements.push('first_flight');
    }
    
    // Add custom welcome stamp
    const stampExists = user.passportStats.stamps.some(s => s.stampId === 'stamp_welcome');
    if (!stampExists) {
      user.passportStats.stamps.push({
        stampId: 'stamp_welcome',
        title: `Welcome to SkyLuxe ${plan.name} Club`,
        country: 'Global',
        date: new Date()
      });
    }

    // Credit loyalty coins (e.g. 500 for silver, 2500 for executive, 10000 for black_elite)
    let coinsAwarded = 500;
    if (plan.id === 'executive') coinsAwarded = 2500;
    if (plan.id === 'black_elite') coinsAwarded = 10000;
    user.coins = (user.coins || 0) + coinsAwarded;

    // Append wallet transaction log
    const transactionId = `TX-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    user.wallet.transactions.push({
      id: transactionId,
      title: `Membership Subscription: SkyLuxe ${plan.name} Tier`,
      amount: cost,
      type: 'debit',
      date: new Date()
    });

    await user.save();

    req.user = user;
    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'membership_purchase', { planId: plan_id, price: cost });

    res.json({
      message: `Subscribed to ${plan.name} successfully`,
      membership: user.membership,
      expiry: user.membershipExpiry,
      balance: user.wallet.balance
    });
  } catch (error) {
    console.error('Membership subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Legacy support routes
router.get('/tiers', (req, res) => {
  res.json(PLANS);
});

router.post('/purchase', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const { tier } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Authentication required' });
    }

    const plan = PLANS.find(p => p.id === tier);
    if (!plan) return res.status(400).json({ error: 'Invalid tier' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.membership = plan.id;
    user.membershipExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await user.save();

    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'membership_purchase', { planId: tier, price: plan.price });

    res.status(201).json({
      message: 'Membership purchased successfully',
      membership: user.membership,
      expiry: user.membershipExpiry,
      membershipId: user._id,
      status: 'active',
      tier: user.membership
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/details', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      tier: user.membership || 'none',
      status: user.membership && user.membership !== 'none' ? 'active' : 'inactive',
      expiryDate: user.membershipExpiry || null
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/renew', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.membershipExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await user.save();
    
    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'membership_renew', { tier: user.membership });
    
    res.json({
      status: 'active',
      renewalDate: user.membershipExpiry
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;