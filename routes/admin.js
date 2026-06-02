const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Refund = require('../models/Refund');
const AuditLog = require('../models/AuditLog');

// 1. Get Analytics Summary
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Revenue aggregations
    const payments = await Payment.find({ status: 'Completed' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const flightRevenue = payments.filter(p => p.type === 'flight').reduce((sum, p) => sum + p.amount, 0);
    const charterRevenue = payments.filter(p => p.type === 'charter').reduce((sum, p) => sum + p.amount, 0);
    const membershipRevenue = payments.filter(p => p.type === 'membership').reduce((sum, p) => sum + p.amount, 0);

    // Membership tier distribution
    const silverMembers = await User.countDocuments({ membership: 'silver' });
    const executiveMembers = await User.countDocuments({ membership: 'executive' });
    const eliteMembers = await User.countDocuments({ membership: 'black_elite' });

    // Success rate of transactions
    const totalTx = await Payment.countDocuments();
    const successTx = await Payment.countDocuments({ status: 'Completed' });
    const paymentSuccessRate = totalTx > 0 ? Math.round((successTx / totalTx) * 100) : 100;

    res.json({
      metrics: {
        totalUsers,
        totalBookings,
        totalRevenue,
        paymentSuccessRate,
        revenues: {
          flight: flightRevenue,
          charter: charterRevenue,
          membership: membershipRevenue
        },
        memberships: {
          silver: silverMembers,
          executive: executiveMembers,
          black_elite: eliteMembers
        }
      }
    });
  } catch (error) {
    console.error('Fetch analytics error:', error);
    res.status(500).json({ message: 'Server error compiling analytics' });
  }
});

// 2. Get All Bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('flight')
      .populate('aircraft')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Fetch admin bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Get All Payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Fetch admin payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Request a Refund
router.post('/refunds/request', async (req, res) => {
  try {
    const { paymentId, amount, reason, userId } = req.body;

    if (!paymentId || !amount || !reason || !userId) {
      return res.status(400).json({ message: 'Payment ID, amount, reason, and User ID are required' });
    }

    const refund = new Refund({
      user: userId,
      payment: paymentId,
      amount: Number(amount),
      reason,
      status: 'Requested'
    });
    await refund.save();

    res.status(201).json({ message: 'Refund request registered', refund });
  } catch (error) {
    console.error('Request refund error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. List All Refunds
router.get('/refunds', async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate('user', 'firstName lastName email')
      .populate('payment')
      .sort({ createdAt: -1 });
    res.json(refunds);
  } catch (error) {
    console.error('Fetch admin refunds error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. Approve Refund Request
router.post('/refunds/:id/approve', async (req, res) => {
  try {
    const { adminComment } = req.body;
    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({ message: 'Refund record not found' });
    }
    if (refund.status !== 'Requested') {
      return res.status(400).json({ message: 'Refund has already been processed' });
    }

    // Find original payment
    const payment = await Payment.findById(refund.payment);
    if (payment) {
      payment.status = 'Refunded';
      await payment.save();
    }

    // Credit funds back to user's wallet
    const user = await User.findById(refund.user);
    if (user) {
      if (!user.wallet) {
        user.wallet = { balance: 0, transactions: [] };
      }
      user.wallet.balance += refund.amount;
      user.wallet.transactions.push({
        id: `RFND-${Date.now().toString().slice(-4)}`,
        title: `Refund Credited: ${refund.reason.slice(0, 30)}`,
        amount: refund.amount,
        type: 'credit',
        date: new Date()
      });
      await user.save();
    }

    refund.status = 'Approved';
    refund.adminComment = adminComment || 'Approved by system administrator';
    await refund.save();

    res.json({ message: 'Refund request approved, wallet credited', refund });
  } catch (error) {
    console.error('Approve refund error:', error);
    res.status(500).json({ message: 'Server error approving refund' });
  }
});

// 7. Reject Refund Request
router.post('/refunds/:id/reject', async (req, res) => {
  try {
    const { adminComment } = req.body;
    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({ message: 'Refund record not found' });
    }
    if (refund.status !== 'Requested') {
      return res.status(400).json({ message: 'Refund has already been processed' });
    }

    refund.status = 'Rejected';
    refund.adminComment = adminComment || 'Rejected by system administrator';
    await refund.save();

    res.json({ message: 'Refund request rejected', refund });
  } catch (error) {
    console.error('Reject refund error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 8. Get Platform Audit Logs
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    console.error('Fetch audit logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
