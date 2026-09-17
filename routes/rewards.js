const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Coupon = require('../models/Coupon');

// Get rewards balance, coupon catalog, and user redemptions
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

    const coupons = await Coupon.find();

    const redemptions = (user.couponsRedeemed || []).map(couponId => ({
      coupon_id: couponId.toString()
    }));

    res.json({
      coins_balance: user.coins || 0,
      coupons: coupons,
      redemptions: redemptions
    });
  } catch (error) {
    console.error('Rewards fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redeem coupon voucher
router.post('/redeem', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const { coupon_id } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!coupon_id) {
      return res.status(400).json({ message: 'Coupon ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const coupon = await Coupon.findById(coupon_id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check if already redeemed
    const isRedeemed = user.couponsRedeemed && user.couponsRedeemed.some(id => id.toString() === coupon_id);
    if (isRedeemed) {
      return res.status(400).json({ message: 'Coupon already redeemed' });
    }

    // Check coins balance
    const userCoins = user.coins || 0;
    if (userCoins < coupon.pointsRequired) {
      return res.status(400).json({ message: 'Insufficient SkyCoins balance' });
    }

    // Deduct coins and add to redeemed list
    user.coins = userCoins - coupon.pointsRequired;
    if (!user.couponsRedeemed) {
      user.couponsRedeemed = [];
    }
    user.couponsRedeemed.push(coupon._id);

    // Append to transactions (optional but nice)
    const transactionId = `TX-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    if (!user.wallet) {
      user.wallet = { balance: 0, transactions: [] };
    }
    user.wallet.transactions.push({
      id: transactionId,
      title: `Redeemed Voucher: ${coupon.brand} - ${coupon.offer}`,
      amount: 0, // Points transaction, not cash
      type: 'debit',
      date: new Date()
    });

    await user.save();

    req.user = user;
    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'loyalty_redeem', { couponId: coupon_id, pointsRequired: coupon.pointsRequired });

    res.json({
      message: 'Coupon redeemed successfully',
      coins_balance: user.coins,
      redemptions: user.couponsRedeemed.map(id => ({ coupon_id: id.toString() }))
    });
  } catch (error) {
    console.error('Coupon redemption error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
