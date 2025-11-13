// backend/controllers/blogController.js
const BlogPost = require('../models/BlogPost');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

// @desc    Create a blog post
// @route   POST /api/blog
// @access  Private/Admin
exports.createBlogPost = async (req, res) => {
  const { title, content } = req.body;

  if (!req.file) {
    return res.status(400).json({ msg: 'Please upload an image.' });
  }

  try {
    const newPost = new BlogPost({
      title,
      content,
      imageUrl: req.file.path,
    });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
exports.getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
exports.deleteBlogPost = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid Post ID' });
  }
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // Delete image file from server
    await fs.unlink(path.join(__dirname, '..', post.imageUrl));
    
    // Delete post from database
    await post.deleteOne();

    res.json({ msg: 'Blog post removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};