const AnalyticsEvent = require('../models/AnalyticsEvent');
const jwt = require('jsonwebtoken');

/**
 * Tracks a structured user event and saves it to the database for ML training.
 * 
 * @param {Object} req - Express request object to extract user, IP, and user-agent
 * @param {string} eventType - The classification category of the event
 * @param {Object} metadata - Optional event-specific metadata parameters
 */
const trackEvent = async (req, eventType, metadata = {}) => {
  try {
    let userId = null;

    // 1. Try to extract userId from req.user (attached by requireAuth middleware)
    if (req.user && (req.user._id || req.user.id)) {
      userId = req.user._id || req.user.id;
    } 
    // 2. Fallback to decoding the authorization header directly
    else {
      const authHeader = req.headers.authorization || req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.decode(token);
        if (decoded && decoded.userId) {
          userId = decoded.userId;
        }
      }
    }

    // 3. Extract IP address and User Agent
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // 4. Save structured event to database
    const event = new AnalyticsEvent({
      userId,
      eventType,
      metadata,
      ip,
      userAgent
    });

    await event.save();
  } catch (error) {
    console.warn(`Analytics Tracker Warning: Failed to log event "${eventType}":`, error.message);
  }
};

module.exports = {
  trackEvent
};
