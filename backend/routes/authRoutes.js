const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Use a strong secret key (ideally from env variables)
const JWT_SECRET = '7c9e3a9f5b4e2d8f1234abcde56789f0e1d2c3b4a5f6d7e8c9b0a1b2c3d4e5f6';

// Define your secret admin code here (should be kept private)
const ADMIN_SECRET_CODE = 'ahmadadmin';

// Signup route// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, adminCode } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role
    const role = adminCode === ADMIN_SECRET_CODE ? 'admin' : 'user';

    // Create user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      {
        userId: user._id,
        fullName: user.fullName,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Send back userId and token like in login
    res.status(201).json({
      message: 'User created successfully',
      token,
      userId: user._id,
      fullName: user.fullName,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token with user info
    const token = jwt.sign(
      {
        userId: user._id,
        fullName: user.fullName,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
  message: 'Login successful',
  token,
  userId: user._id,
  fullName: user.fullName,
  role: user.role  // <-- role sent here
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
