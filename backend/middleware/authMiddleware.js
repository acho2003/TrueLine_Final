// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure the path to your User model is correct

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using the secret from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token's ID and attach to the request
      req.user = await User.findById(decoded.id).select('-password');
      
      // 4. If user not found for that token, deny access
      if (!req.user) {
          return res.status(401).json({ msg: 'Not authorized, user not found' });
      }

      // 5. Success, proceed to the next function (the controller)
      next();
    } catch (err) {
      // This will catch errors from jwt.verify (e.g., invalid token, expired token)
      console.error('Token verification failed:', err.message);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  } else {
    // This 'else' block fixes the potential double-response bug
    res.status(401).json({ msg: 'Not authorized, no token provided' });
  }
};