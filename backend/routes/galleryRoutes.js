// backend/routes/galleryRoutes.js

const express = require('express');
const router = express.Router();

// --- CONTROLLER AND MIDDLEWARE IMPORTS ---
const { 
  getGalleryItems, 
  createGalleryItem, 
  deleteGalleryItem 
} = require('../controllers/galleryController');

const { protect } = require('../middleware/authMiddleware');

// The ONLY place 'upload' should come from is your dedicated middleware file.
const upload = require('../middleware/uploadMiddleware');

// --- ROUTES DEFINITION ---

// This handles GET (public) and POST (protected, with upload) for the main gallery resource.
router.route('/manage')
  .get(getGalleryItems) // Publicly viewable
  .post(
    protect, // First, ensure the user is logged in
    upload.fields([ // Then, handle the file uploads
      { name: 'beforePhotos', maxCount: 5 },
      { name: 'afterPhotos', maxCount: 5 }
    ]),
    createGalleryItem // Finally, run the controller logic
  );

// This handles deleting a specific gallery item (protected).
router.route('/manage/:id')
  .delete(protect, deleteGalleryItem);

module.exports = router;