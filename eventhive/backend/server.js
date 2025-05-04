const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const { createTestUser } = require('./controllers/userController'); // Import from controller

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());  // Parse JSON bodies
app.use(cors());          // Enable CORS
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Create the test user when the server starts
createTestUser();
