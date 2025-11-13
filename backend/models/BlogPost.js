// backend/models/BlogPost.js
const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content for the blog post'],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  author: { // Optional: You can expand on this later
    type: String,
    default: 'Admin',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);