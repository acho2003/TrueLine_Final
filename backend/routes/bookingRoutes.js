// backend/routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const {
  getBookings,
  createBooking,
  updateBookingStatus,
  // uploadPhotos, // <- No longer needed if you remove the route
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware'); // <- No longer needed

router.route('/').get(protect, getBookings).post(createBooking);
router.route('/:id').delete(protect, deleteBooking);
router.route('/:id/status').put(protect, updateBookingStatus);

// DELETE OR COMMENT OUT THIS LINE
// router.route('/:id/photos').post(protect, upload.array('photos', 10), uploadPhotos);

module.exports = router;