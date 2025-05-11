const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('📦 Register request body:', req.body); 
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });     
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
  console.error('❌ Register error:', err);  // Log actual error in Render logs
  res.status(500).json({ msg: 'Server error', error: err.message });
}
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

const auth = (req, res, next) => {
  const rawHeader = req.header('Authorization');
  const token = rawHeader?.split(' ')[1];

  console.log('Authorization header:', rawHeader); // Full header
  console.log('Extracted token:', token); // Just the token

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    console.log('JWT verification failed:', e.message);
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

module.exports = router;
