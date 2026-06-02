const mongoose = require('mongoose');

const conciergeRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Catering', 'Chauffeur', 'Security', 'Helicopter', 'Private Chef', 'Private Security', 'Hotel Booking', 'Business Meeting', 'Airport Assistance', 'VIP Lounge', 'Travel Insurance'],
    required: true
  },
  details: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'In Transit', 'Completed'],
    default: 'Pending'
  },
  flightId: {
    type: String, // String representation or booking reference
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

conciergeRequestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.created_at = ret.createdAt;
    return ret;
  }
});

module.exports = mongoose.model('ConciergeRequest', conciergeRequestSchema);
