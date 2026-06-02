const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false // Nullable for wallet topups / membership purchases
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  items: [{
    description: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  }],
  taxAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  pdfPath: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

invoiceSchema.pre('validate', async function(next) {
  if (!this.invoiceNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900).toString();
    this.invoiceNumber = `INV-2026-${timestamp}${random}`;
  }
  next();
});

invoiceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
