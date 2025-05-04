const bcrypt = require('bcrypt');
const User = require('../models/User');

const createTestUser = async () => {
  try {
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);

      const user = new User({
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      });

      await user.save();
      console.log('Test user created');
    } else {
      console.log('Test user already exists');
    }
  } catch (error) {
    console.error('Error creating test user', error);
  }
};

module.exports = { createTestUser };
