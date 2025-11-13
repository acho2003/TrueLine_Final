const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  preferredDateTime: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'In Progress', 'Completed', 'Canceled'],
    default: 'Pending',
  },
  beforePhotos: {
    type: [String],
  },
  afterPhotos: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);