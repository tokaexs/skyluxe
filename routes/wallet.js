const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get wallet balance and transactions
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      balance: user.wallet?.balance || 0,
      transactions: user.wallet?.transactions || []
    });
  } catch (error) {
    console.error('Wallet fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Top up wallet funds
router.post('/topup', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const { amount } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid topup amount' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transactionId = `TX-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;

    if (!user.wallet) {
      user.wallet = { balance: 0, transactions: [] };
    }

    user.wallet.balance += Number(amount);
    user.wallet.transactions.push({
      id: transactionId,
      title: 'Wallet Funding via Wire',
      amount: Number(amount),
      type: 'credit',
      date: new Date()
    });

    await user.save();

    req.user = user;
    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'wallet_topup', { amount: Number(amount) });

    res.json({
      message: 'Wallet funded successfully',
      balance: user.wallet.balance,
      transactions: user.wallet.transactions
    });
  } catch (error) {
    console.error('Wallet topup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Withdraw wallet funds
router.post('/withdraw', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const { amount } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.wallet || user.wallet.balance < Number(amount)) {
      return res.status(400).json({ message: 'Insufficient wallet balance for withdrawal' });
    }

    const transactionId = `TX-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;

    user.wallet.balance -= Number(amount);
    user.wallet.transactions.push({
      id: transactionId,
      title: 'Wallet Funds Withdrawal',
      amount: -Number(amount),
      type: 'debit',
      date: new Date()
    });

    await user.save();

    req.user = user;
    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'wallet_payment', { amount: Number(amount), purpose: 'withdrawal' });

    res.json({
      message: 'Withdrawal processed successfully',
      balance: user.wallet.balance,
      transactions: user.wallet.transactions
    });
  } catch (error) {
    console.error('Wallet withdrawal error:', error);
    res.status(500).json({ message: 'Server error processing withdrawal' });
  }
});

module.exports = router;
