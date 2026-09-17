const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');
const { generatePassportPDF } = require('../lib/passportGenerator');
const path = require('path');

// Download Passport PDF
router.get('/passport/download', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pdfPath = await generatePassportPDF(user);
    const absolutePath = path.join(__dirname, '..', pdfPath);
    
    res.download(absolutePath, `sovereign-passport-${user._id}.pdf`);
  } catch (error) {
    console.error('Passport PDF generation error:', error);
    res.status(500).json({ message: 'Server error generating passport PDF' });
  }
});

// Update user details
router.patch('/:id', async (req, res) => {
  try {
    const { first_name, last_name, firstName, lastName, phone, country } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (first_name !== undefined) user.firstName = first_name;
    if (firstName !== undefined) user.firstName = firstName;
    
    if (last_name !== undefined) user.lastName = last_name;
    if (lastName !== undefined) user.lastName = lastName;
    
    if (phone !== undefined) user.phone = phone;
    if (country !== undefined) user.country = country;

    await user.save();

    const { trackEvent } = require('../lib/analytics');
    await trackEvent(req, 'update_profile');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        country: user.country
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
