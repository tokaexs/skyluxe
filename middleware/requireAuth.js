const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    let token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const targetId = decoded.userId || decoded.id || decoded._id || decoded.sub;
        const user = targetId ? await User.findById(targetId).select('-password') : null;
        if (user) {
          req.user = user;
          return next();
        }
      } catch (err) {
        console.warn('JWT verification failed in requireAuth:', err.message);
      }
    }

    // 2. Fallback to Passport session
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      // Ensure user details are loaded
      if (!req.user.email) {
        req.user = await User.findById(req.user._id || req.user.id).select('-password');
      }
      return next();
    }

    return res.status(401).json({ message: 'Authorization denied. Please log in.', error: 'Authorization denied. Please log in.' });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid or authorization denied', error: 'Token is not valid or authorization denied' });
  }
};

module.exports = requireAuth;
