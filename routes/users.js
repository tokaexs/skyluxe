const express = require('express');
const router = express.Router();
const User = require('../models/User');

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
