// middleware/auth.js
const jwt = require('jsonwebtoken');
console.log('JWT_SECRET in use:', process.env.JWT_SECRET);

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded = { id, iat, exp }
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
