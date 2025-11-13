// backend/models/GalleryItem.js
const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: [true, 'Please provide a service type'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  beforePhotos: {
    type: [String],
    required: true,
  },
  afterPhotos: {
    type: [String],
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);