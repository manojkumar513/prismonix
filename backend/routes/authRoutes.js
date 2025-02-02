const express = require('express');
const { loginUser, registerUser, saveDeveloperProfile, saveInnovatorProfile, saveInvestorProfile } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate'); // Middleware for token validation

const router = express.Router();

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Login a user
// @route   POST /auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Save developer profile
// @route   POST /auth/developer-profile
// @access  Private (requires authentication)
router.post('/developer-profile', authenticate, saveDeveloperProfile);



router.post('/innovator-profile', authenticate, saveInnovatorProfile);



router.post('/investor-profile', authenticate, saveInvestorProfile);


module.exports = router;