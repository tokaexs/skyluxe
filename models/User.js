const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  membership: {
    type: String,
    enum: ['none', 'silver', 'gold', 'platinum', 'executive', 'black elite', 'black_elite'],
    default: 'none'
  },
  membershipExpiry: {
    type: Date
  },
  points: {
    type: Number,
    default: 0
  },
  passportStats: {
    countriesVisited: { type: [String], default: [] },
    favoriteDestinations: { type: [String], default: [] },
    privateJetHours: { type: Number, default: 0 },
    flightsTaken: { type: Number, default: 0 },
    stamps: [{
      stampId: String,
      title: String,
      country: String,
      date: { type: Date, default: Date.now }
    }]
  },
  achievements: {
    type: [String],
    default: []
  },
  preferences: {
    dietary: { type: String, default: "No shellfish. Preferred sparkling water." },
    beverages: { type: String, default: "Macallan 18, San Pellegrino, Espresso" },
    groundTransport: { type: String, default: "Luxury SUV (Cadillac Escalade / Range Rover)" },
    cabinAmbiance: { type: String, default: "Dimmed lighting during night flights. Temperature set to 21°C." }
  },
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: ['debit', 'credit'], required: true },
      date: { type: Date, default: Date.now },
      invoice: { type: String }
    }]
  },
  coins: {
    type: Number,
    default: 1250
  },
  couponsRedeemed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  }],
  securityLogs: [{
    action: String,
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
  }],
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  appleId: {
    type: String,
    unique: true,
    sparse: true
  },
  provider: {
    type: String,
    default: 'local'
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 