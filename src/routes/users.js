// src/routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user-controller');

// User registration route
router.post('/register', usersController.registerUser);
router.post('/signin', usersController.signInUser);

// Other routes...
module.exports = router;