// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// --- THIS IS THE FIX ---
// Load environment variables IMMEDIATELY, before any other imports that might need them.
dotenv.config();
// ----------------------

// Now that process.env is populated, we can safely import other files.
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

// Connect to the database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/gallery', galleryRoutes);
const blogRoutes = require('./routes/blogRoutes');

// ... (in the app.use section)
app.use('/api/blog', blogRoutes);
// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));