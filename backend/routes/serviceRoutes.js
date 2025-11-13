// serviceRoutes.js

const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  getServiceById,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Add a simple logging middleware for debugging
const logMiddleware = (req, res, next) => {
    console.log(`[ServiceRoutes] Request to ${req.method} ${req.originalUrl}`);
    console.log(`[ServiceRoutes] Body:`, req.body);
    console.log(`[ServiceRoutes] File:`, req.file);
    next();
};

router.route('/')
  .get(getServices) // Public route
  .post(protect, logMiddleware, upload.single('image'), createService); // Admin route, handles single file upload



router.route('/:id')
  .get(getServiceById) // ✅ Add this line
  .put(protect, logMiddleware, upload.single('image'), updateService)
  .delete(protect, logMiddleware, deleteService);


module.exports = router;