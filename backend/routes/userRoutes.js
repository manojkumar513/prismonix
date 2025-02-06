const express = require('express');
const router = express.Router();
const { getUserDetails } = require('../controllers/userController');
const User = require('../models/User'); // Assuming you have a User model

// Existing route to fetch user details by ID
router.get('/:id', getUserDetails);

// New route to fetch all users (including usernames)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Fetch only the usernames
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
