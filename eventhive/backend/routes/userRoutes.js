// backend/routes/userRoutes.js
import express from 'express';

const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('User routes are working!');
});

export default router;
