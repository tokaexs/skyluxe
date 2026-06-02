const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  offer: {
    type: String,
    required: true
  },
  pointsRequired: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

couponSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.points_required = ret.pointsRequired;
    ret.image_url = ret.imageUrl;
    return ret;
  }
});

module.exports = mongoose.model('Coupon', couponSchema);
