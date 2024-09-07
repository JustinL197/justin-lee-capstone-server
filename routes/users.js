const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user-controller');
const authenticateUser = require('../middleware/authenticateUser');

// User registration and login routes
router.post('/register', usersController.registerUser);
router.post('/signin', usersController.signInUser);

// Get all users (for admin purposes, possibly?)
router.get('/', authenticateUser, usersController.getAllUsers);

// Get the current user's details
router.get('/current', authenticateUser, usersController.getCurrentUser);

// Update current user's details
router.put('/current/update', authenticateUser, usersController.updateUserDetails);

module.exports = router;