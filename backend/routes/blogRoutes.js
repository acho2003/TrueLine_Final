// backend/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const { createBlogPost, getBlogPosts, deleteBlogPost } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET all posts (Public) & CREATE a post (Private)
router.route('/')
  .get(getBlogPosts)
  .post(protect, upload.single('image'), createBlogPost); // 'image' is the field name for the file

// DELETE a post (Private)
router.route('/:id').delete(protect, deleteBlogPost);

module.exports = router;