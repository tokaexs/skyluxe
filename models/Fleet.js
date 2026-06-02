const mongoose = require('mongoose');

const fleetSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  range: {
    type: String, // e.g. "7,700 nm"
    required: true
  },
  speed: {
    type: String, // e.g. "Mach 0.925"
    required: true
  },
  capacity: {
    type: Number, // e.g. 19
    required: true
  },
  hourlyRate: {
    type: Number, // e.g. 9500
    required: true
  },
  classType: {
    type: String, // e.g. "Ultra Long Range", "Heavy Jet"
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  amenities: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Fleet', fleetSchema);
