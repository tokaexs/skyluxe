const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Requested', 'Approved', 'Rejected'],
    default: 'Requested'
  },
  adminComment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

refundSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Refund', refundSchema);
