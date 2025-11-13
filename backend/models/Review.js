const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  // avatarUrl is optional, you might not manage this from the backend initially
  avatarUrl: {
    type: String,
  },
});

module.exports = mongoose.model('Review', ReviewSchema);