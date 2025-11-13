const Booking = require('../models/Booking');

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  const { name, phone, address, serviceType, preferredDateTime, notes } = req.body;

  try {
    const newBooking = new Booking({
      name,
      phone,
      address,
      serviceType,
      preferredDateTime,
      notes,
    });

    const booking = await newBooking.save();

    // No Twilio/WhatsApp notification here
    console.log('Booking created:', booking);

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Upload photos
exports.uploadPhotos = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    const { type } = req.body;
    const files = req.files;

    if (type === 'before') {
      files.forEach((file) => booking.beforePhotos.push(file.path));
    } else {
      files.forEach((file) => booking.afterPhotos.push(file.path));
    }

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    await booking.deleteOne(); // <-- fix here
    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
