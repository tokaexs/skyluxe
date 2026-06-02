const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String, // Razorpay Order ID
    required: true,
    unique: true
  },
  paymentId: {
    type: String, // Razorpay Payment ID
    sparse: true,
    unique: true
  },
  signature: {
    type: String // Razorpay validation signature
  },
  amount: {
    type: Number, // In USD (or standard currency unit)
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  method: {
    type: String, // e.g. "upi", "card", "netbanking", "wallet"
    default: 'card'
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'Cancelled', 'Disputed'],
    default: 'Pending'
  },
  type: {
    type: String,
    enum: ['flight', 'charter', 'membership', 'topup'],
    required: true
  },
  metadata: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

paymentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
