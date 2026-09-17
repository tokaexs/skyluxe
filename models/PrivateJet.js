const mongoose = require('mongoose');

const privateJetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  range: { type: Number, required: true },
  speed: { type: Number, required: true },
  amenities: [{ type: String }],
  hourlyRate: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('PrivateJet', privateJetSchema);
