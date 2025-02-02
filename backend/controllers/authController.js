const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DeveloperProfile = require('../models/DeveloperProfiles');
const InnovatorProfile = require('../models/InnovatorProfile');
const InvestorProfile = require('../models/InvestorProfiles')
// @desc    Login a user
// @route   POST /auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '1h' });
    return res.status(200).json({ token, user });
  } catch (err) {
    console.error('Login error:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({ firstName, lastName, email, password, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '1h' });
    return res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error('Registration error:', err); // Log the error for debugging
    res.status(500).json({ message: 'Registration failed. Please try again later.' });
  }
};

// @desc    Save or update developer profile
// @route   POST /auth/developer-profile
// @access  Private
exports.saveDeveloperProfile = async (req, res) => {
  const { 
    location, 
    definesYou, 
    education, 
    skills, 
    preferredEmploymentType, 
    preferredWorkEnvironment, 
    experience, 
    termsAccepted 
  } = req.body;
  
  const userId = req.userId; // Extract from middleware for authenticated requests

  if (!termsAccepted) {
    return res.status(400).json({ message: 'Please accept the terms and conditions' });
  }

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    // Check if the profile already exists
    let developerProfile = await DeveloperProfile.findOne({ userId });

    if (developerProfile) {
      // Update existing profile
      developerProfile.location = location;
      developerProfile.definesYou = definesYou;
      developerProfile.education = education;
      developerProfile.skills = skills;
      developerProfile.preferredEmploymentType = preferredEmploymentType;
      developerProfile.preferredWorkEnvironment = preferredWorkEnvironment;
      developerProfile.experience = experience;
      developerProfile.termsAccepted = termsAccepted;
    } else {
      // Create new profile
      developerProfile = new DeveloperProfile({
        userId,
        location,
        definesYou,
        education,
        skills,
        preferredEmploymentType,
        preferredWorkEnvironment,
        experience,
        termsAccepted,
      });
    }

    await developerProfile.save();
    res.status(201).json({ message: 'Profile saved successfully', profile: developerProfile });
  } catch (err) {
    console.error('Save profile error:', err); // Log the error for debugging
    res.status(500).json({ message: 'Failed to save profile. Please try again later.' });
  }
};



// @desc    Save or update innovator profile
// @route   POST /auth/innovator-profile
// @access  Private
exports.saveInnovatorProfile = async (req, res) => {
    const { 
        location,
        education,
        currentRole,
        skills,
        industryFocus,
        expertise,
        innovationCategories,
        collaborationType,
        needs,
        portfolioURL,
        termsAccepted, 
    } = req.body;
    
    const userId = req.userId; // Extract from middleware for authenticated requests
  
    if (!termsAccepted) {
      return res.status(400).json({ message: 'Please accept the terms and conditions' });
    }
  
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found' });
    }
  
    try {
      // Check if the profile already exists
      let innovatorProfile = await InnovatorProfile.findOne({ userId });
  
      if (innovatorProfile) {
        // Update existing profile
        innovatorProfile.location = location;
        innovatorProfile.definesYou = definesYou;
        innovatorProfile.education = education;
        innovatorProfile.skills = skills;
        innovatorProfile.preferredEmploymentType = preferredEmploymentType;
        innovatorProfile.preferredWorkEnvironment = preferredWorkEnvironment;
        innovatorProfile.experience = experience;
        innovatorProfile.termsAccepted = termsAccepted;
      } else {
        // Create new profile
        innovatorProfile = new InnovatorProfile({
            userId,
            location,
            education,
            currentRole,
            skills,
            industryFocus,
            expertise,
            innovationCategories,
            collaborationType,
            needs,
            portfolioURL,
            termsAccepted, 
        });
      }
  
      await innovatorProfile.save();
      res.status(201).json({ message: 'Profile saved successfully', profile: innovatorProfile });
    } catch (err) {
      console.error('Save profile error:', err); // Log the error for debugging
      res.status(500).json({ message: 'Failed to save profile. Please try again later.' });
    }
  };



// @desc    Save or update investor profile
// @route   POST /auth/investor-profile
// @access  Private
  exports.saveInvestorProfile = async (req, res) => {
    const { 
        location,
        education,
        investmentFocus,
        capitalRange,
        investmentStage,
        portfolioCompanies,
        portfolioUrl,
        termsAccepted,
    } = req.body;
    
    const userId = req.userId; // Extract from middleware for authenticated requests
  
    if (!termsAccepted) {
      return res.status(400).json({ message: 'Please accept the terms and conditions' });
    }
  
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found' });
    }
  
    try {
      // Check if the profile already exists
      let investorProfile = await InvestorProfile.findOne({ userId });
  
      if (investorProfile) {
        // Update existing profile
        investorProfile.location = location;
        investorProfile.education = education;
        investorProfile.investmentFocus = investmentFocus;
        investorProfile.capitalRange = capitalRange;
        investorProfile.investmentStage = investmentStage;
        investorProfile.portfolioCompanies = portfolioCompanies;
        investorProfile.portfolioUrl = portfolioUrl;
        investorProfile.termsAccepted = termsAccepted;
      } else {
        // Create new profile
        investorProfile = new InvestorProfile({
            userId,
            location,
            education,
            investmentFocus,
            capitalRange,
            investmentStage,
            portfolioCompanies,
            portfolioUrl,
            termsAccepted,
        });
      }
  
      await investorProfile.save();
      res.status(201).json({ message: 'Profile saved successfully', profile: investorProfile });
    } catch (err) {
      console.error('Save profile error:', err); // Log the error for debugging
      res.status(500).json({ message: 'Failed to save profile. Please try again later.' });
    }
  };