const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;

// Create Test User (for debugging only — remove in production!)
router.post('/test-user', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'test@example.com' });
    if (existing) return res.status(400).json({ message: 'Test user already exists' });

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      username: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'Test user created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating test user' });
  }
});


