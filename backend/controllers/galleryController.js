// backend/controllers/galleryController.js

const GalleryItem = require('../models/GalleryItem');
const fs = require('fs').promises; // <-- THE FIX: Use the promises version of fs
const path = require('path');
const mongoose = require('mongoose');

// @desc    Fetch all manageable gallery items
// @route   GET /api/gallery/manage
// @access  Public
exports.getGalleryItems = async (req, res) => {
    try {
        const items = await GalleryItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Create a new gallery item
// @route   POST /api/gallery/manage
// @access  Private/Admin
exports.createGalleryItem = async (req, res) => {
    const { serviceType, description } = req.body;
    if (!req.files || !req.files.beforePhotos || !req.files.afterPhotos) {
        return res.status(400).json({ msg: 'Please upload both before and after photos.' });
    }
    try {
        const beforePhotos = req.files.beforePhotos.map(file => file.path);
        const afterPhotos = req.files.afterPhotos.map(file => file.path);
        const newItem = new GalleryItem({ serviceType, description, beforePhotos, afterPhotos });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Delete a gallery item (Robust Version)
// @route   DELETE /api/gallery/manage/:id
// @access  Private/Admin
exports.deleteGalleryItem = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid gallery item ID' });
  }
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    const photoPaths = [...item.beforePhotos, ...item.afterPhotos];
    
    // 1. Delete the record from the database
    await item.deleteOne();

    // 2. Asynchronously delete all associated files from the server
    await Promise.all(
      photoPaths.map(async (photoPath) => {
        try {
          const fullPath = path.join(__dirname, '..', photoPath);
          // This await now works correctly because we are using fs.promises
          await fs.unlink(fullPath);
        } catch (fileErr) {
          console.error(`Failed to delete file: ${photoPath}`, fileErr);
        }
      })
    );
    
    res.json({ msg: 'Gallery item successfully removed' });
  } catch (err) {
    console.error('Error during gallery item deletion:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};