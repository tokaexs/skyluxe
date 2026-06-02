const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get all notifications for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    let notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    // Seed default notifications if none exist
    if (notifications.length === 0) {
      notifications = [
        new Notification({
          user: userId,
          title: 'Flight Prepared',
          message: 'Gulfstream G650ER is fueled and positioned at BOM VIP Terminal.',
          type: 'flight',
          unread: true
        }),
        new Notification({
          user: userId,
          title: 'FBO Account Funded',
          message: 'Your wire transfer of $250,000 has been credited to your FBO Wallet.',
          type: 'wallet',
          unread: false
        })
      ];
      for (const n of notifications) {
        await n.save();
      }
      notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    }

    res.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.post('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.unread = false;
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
