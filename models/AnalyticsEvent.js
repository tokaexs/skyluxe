const mongoose = require('mongoose');

const AnalyticsEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  eventType: {
    type: String,
    enum: [
      'login',
      'logout',
      'register',
      'search_flights',
      'book_flight',
      'view_jet',
      'charter_request',
      'cancel_charter',
      'concierge_request',
      'cancel_concierge',
      'membership_purchase',
      'membership_renew',
      'wallet_topup',
      'wallet_payment',
      'loyalty_redeem',
      'view_profile',
      'update_profile',
      'read_notification',
      'page_view'
    ],
    required: true,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsEventSchema.index({ userId: 1, eventType: 1 });

module.exports = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
