const mongoose = require('mongoose');

const charterRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jetId: { type: mongoose.Schema.Types.ObjectId, ref: 'PrivateJet', required: true },
  departure: {
    city: { type: String, required: true },
    airport: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
  },
  arrival: {
    city: { type: String, required: true },
    airport: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
  },
  passengers: { type: Number, required: true },
  specialRequests: { type: String },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CharterRequest', charterRequestSchema);
