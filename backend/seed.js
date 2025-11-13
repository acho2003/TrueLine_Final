// backend/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Adjust the path if your models are elsewhere
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const importData = async () => {
  try {
    // --- Define your Admin User ---
    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123'; // Choose a secure password

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit();
    }

    // Create the new admin user
    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword, // The password will be hashed by the User model's 'pre-save' hook
    });

    await adminUser.save();

    console.log('Admin User Created Successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check for a command-line argument to destroy data (optional)
if (process.argv[2] === '-d') {
  // You could add a destroyData function here if needed
} else {
  importData();
}