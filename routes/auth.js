const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Register user
router.post('/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').optional().trim()
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password, phone } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        password,
        phone
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          membership: user.membership
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login user
router.post('/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          membership: user.membership
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile',
  [
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    body('phone').optional().trim()
  ],
  async (req, res) => {
    try {
      const { firstName, lastName, phone } = req.body;
      const user = await User.findById(req.user.userId);

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;

      await user.save();
      res.json(user);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

const passport = require('passport');
const requireAuth = require('../middleware/requireAuth');

// Trigger Google OAuth Flow
router.get('/google', (req, res, next) => {
  console.log('Backend log: Google OAuth login flow initiated');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed', session: true }),
  (req, res) => {
    try {
      console.log('Backend log: Google OAuth callback success for user:', req.user.email);
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      console.log('Backend log: JWT successfully generated, redirecting to dashboard');
      // Redirect to dashboard with token as query parameter
      res.redirect(`/dashboard?token=${token}`);
    } catch (error) {
      console.error('Backend log: Error during Google OAuth callback processing:', error);
      res.redirect('/login?error=server_error');
    }
  }
);

// Fetch authenticated user
router.get('/me', requireAuth, (req, res) => {
  console.log('Backend log: Fetching authenticated user details for:', req.user.email);
  res.json({
    id: req.user._id || req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    membership: req.user.membership,
    avatar: req.user.avatar,
    provider: req.user.provider
  });
});

// Logout user
router.post('/logout', (req, res, next) => {
  console.log('Backend log: Logout request initiated');
  req.logout((err) => {
    if (err) {
      console.error('Backend log: Error logging out via passport:', err);
      return next(err);
    }
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Backend log: Error destroying express session:', destroyErr);
        return res.status(500).json({ message: 'Error clearing session' });
      }
      res.clearCookie('connect.sid');
      console.log('Backend log: Session cleared and cookie removed successfully');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

module.exports = router;
 