const express = require('express');
const router = express.Router();
const { getUserDetails } = require('../controllers/userController');

router.get('/:id', getUserDetails);

module.exports = router;
