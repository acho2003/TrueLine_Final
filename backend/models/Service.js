// const Service = require('../models/Service');
// ... (omitted)

const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  // --- NEW FIELD ---
  details: {
    type: [String], // Array of strings for the list of things they do
    default: [],
  },
  // -----------------
});

module.exports = mongoose.model('Service', ServiceSchema);