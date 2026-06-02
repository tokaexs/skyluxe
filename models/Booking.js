const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['commercial', 'private'],
    default: 'commercial'
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: false
  },
  aircraft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fleet',
    required: false
  },
  aircraftModel: {
    type: String,
    required: false
  },
  passengers: [{
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    age: { type: Number, required: false },
    passportNumber: { type: String, required: false },
    nationality: { type: String, required: false }
  }],
  class: {
    type: String,
    enum: ['economy', 'business', 'first', 'private'],
    default: 'private'
  },
  seats: [{
    type: String,
    required: false
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid'
  },
  paymentMethod: {
    type: String,
    default: 'wallet'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  // Charter-specific fields
  legs: [{
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true },
    passengers: { type: Number, default: 1 }
  }],
  catering: { type: String },
  chauffeur: { type: String },
  security: { type: String },
  // Boarding Pass fields
  boardingPass: {
    qrCode: { type: String },
    gate: { type: String, default: 'V1' },
    terminal: { type: String, default: 'VIP Terminal' },
    boardingTime: { type: String, default: '08:30' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.pre('validate', async function(next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingReference = `SKL${timestamp}${random}`;
  }
  next();
});

bookingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.total_amount = ret.totalPrice;
    ret.seat_number = ret.seats?.[0] || '1A';
    ret.created_at = ret.createdAt;
    
    // Boarding pass mapping
    ret.boarding_passes = [{
      boarding_time: ret.boardingPass?.boardingTime || '08:30',
      gate: ret.boardingPass?.gate || 'V1',
      terminal: ret.boardingPass?.terminal || 'VIP Terminal'
    }];
    
    return ret;
  }
});

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingReference: 1 });

module.exports = mongoose.model('Booking', bookingSchema);