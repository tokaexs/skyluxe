const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema({
  airlineCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  airlineName: {
    type: String,
    required: true,
    trim: true
  },
  iataCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  icaoCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  logoUrl: {
    type: String,
    trim: true
  },
  brandColor: {
    type: String,
    trim: true,
    default: '#D4AF37' // Default gold
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  alliance: {
    type: String,
    trim: true,
    default: 'None'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

airlineSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Airline', airlineSchema);
