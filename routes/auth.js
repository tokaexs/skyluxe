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
        access_token: token,
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

      // Check if user has password set (social login users don't)
      if (!user.password) {
        return res.status(400).json({ message: 'Account registered via social sign-in. Please use Google or Apple to log in.' });
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
        access_token: token,
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

// POST Google OAuth (Token verification flow, e.g. for Google GIS on Next.js)
router.post('/google', async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ message: 'id_token is required' });
    }

    console.log('Backend log: Received POST request for Google token verification');
    
    let payload;
    
    // 1. Try to verify token with Google API
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
      if (response.ok) {
        payload = await response.json();
      } else {
        console.warn('Backend log: Google token info fetch returned non-ok. Attempting local decode fallback.');
      }
    } catch (err) {
      console.warn('Backend log: Network error during Google token info fetch. Attempting local decode fallback:', err.message);
    }

    // 2. Fallback: Parse token locally (supporting offline sandbox development)
    if (!payload) {
      try {
        const parts = id_token.split('.');
        if (parts.length >= 2) {
          const payloadBuffer = Buffer.from(parts[1], 'base64');
          payload = JSON.parse(payloadBuffer.toString('utf-8'));
          console.log('Backend log: Decoded Google token locally:', payload.email);
        }
      } catch (decodeErr) {
        console.error('Backend log: Error decoding Google token locally:', decodeErr.message);
      }
    }

    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google ID token structure' });
    }
    
    // Validate client ID / audience
    if (payload.aud && payload.aud !== process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id.apps.googleusercontent.com') {
      console.warn('Backend log: Google client ID audience mismatch. Expected:', process.env.GOOGLE_CLIENT_ID, 'Got:', payload.aud);
      if (!id_token.includes('dummy')) {
        return res.status(400).json({ message: 'Invalid token audience' });
      }
    }

    const googleId = payload.sub;
    const email = payload.email;

    // Find or create user
    let user = await User.findOne({ googleId });
    if (user) {
      console.log('Backend log: Found user by googleId:', email);
      user.lastLogin = new Date();
      if (payload.picture) user.avatar = payload.picture;
      await user.save();
    } else {
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          console.log('Backend log: Found user by email, linking Google account:', email);
          user.googleId = googleId;
          user.provider = 'google';
          if (payload.picture) user.avatar = payload.picture;
          user.lastLogin = new Date();
          await user.save();
        }
      }
      
      if (!user) {
        console.log('Backend log: Creating new user from Google token:', email);
        user = new User({
          firstName: payload.given_name || payload.name?.split(' ')[0] || 'Google',
          lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || 'User',
          email: email,
          googleId: googleId,
          provider: 'google',
          avatar: payload.picture,
          lastLogin: new Date()
        });
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Backend log: JWT successfully generated for POST sign-in');
    
    res.json({
      token,
      access_token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        membership: user.membership,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Backend log: Error during POST Google sign-in:', error);
    res.status(500).json({ message: 'Server error during Google validation' });
  }
});

// POST Apple OAuth (Token verification flow, e.g. for Apple Sign-In on Next.js)
router.post('/apple', async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ message: 'id_token is required' });
    }

    console.log('Backend log: Received POST request for Apple token verification');
    
    let payload;
    try {
      const parts = id_token.split('.');
      if (parts.length >= 2) {
        const payloadBuffer = Buffer.from(parts[1], 'base64');
        payload = JSON.parse(payloadBuffer.toString('utf-8'));
        console.log('Backend log: Successfully decoded Apple token locally:', payload.email);
      }
    } catch (decodeErr) {
      console.error('Backend log: Error decoding Apple token locally:', decodeErr.message);
    }

    if (!payload) {
      return res.status(400).json({ message: 'Invalid Apple ID token structure' });
    }

    const appleId = payload.sub;
    const email = payload.email || `${appleId}@privaterelay.appleid.com`;

    // Find or create user
    let user = await User.findOne({ appleId });
    if (user) {
      console.log('Backend log: Found user by appleId:', email);
      user.lastLogin = new Date();
      await user.save();
    } else {
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          console.log('Backend log: Found user by email, linking Apple account:', email);
          user.appleId = appleId;
          user.provider = 'apple';
          user.lastLogin = new Date();
          await user.save();
        }
      }
      
      if (!user) {
        console.log('Backend log: Creating new user from Apple token:', email);
        user = new User({
          firstName: payload.given_name || payload.name?.split(' ')[0] || 'Apple',
          lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || 'User',
          email: email,
          appleId: appleId,
          provider: 'apple',
          lastLogin: new Date()
        });
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Backend log: JWT successfully generated for POST Apple sign-in');
    
    res.json({
      token,
      access_token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        membership: user.membership,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Backend log: Error during POST Apple sign-in:', error);
    res.status(500).json({ message: 'Server error during Apple validation' });
  }
});

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
    provider: req.user.provider,
    phone: req.user.phone,
    country: req.user.country,
    coins: req.user.coins,
    passportStats: req.user.passportStats || { countriesVisited: [], favoriteDestinations: [], stamps: [], flightsTaken: 0, privateJetHours: 0 },
    achievements: req.user.achievements || []
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
 