const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

// Dashboard overview endpoint
router.get('/overview', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = await Booking.find({ user: userId });
    const upcomingFlightsCount = bookings.length;
    const walletBalance = user.wallet?.balance || 0;

    const recentActivities = [
      { description: "Account registered securely", timestamp: user.createdAt || new Date() },
      { description: "FBO corporate wallet initialized", timestamp: user.createdAt || new Date() }
    ];

    const monthlySpend = [150000.0, 320000.0, 180000.0, 410000.0, 290000.0, 0.0];
    const spendLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    res.json({
      upcoming_flights_count: upcomingFlightsCount,
      active_charters_count: 0,
      wallet_balance: walletBalance,
      reward_coins: user.coins || 0,
      membership_tier: user.membership || 'silver',
      recent_activities: recentActivities,
      monthly_spend: monthlySpend,
      spend_labels: spendLabels
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard overview' });
  }
});

module.exports = router;
