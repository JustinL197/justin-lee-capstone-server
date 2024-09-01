// src/routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user-controller');

router.post('/register', usersController.registerUser);
router.post('/signin', usersController.signInUser);

router.get('/', usersController.getAllUsers)
router.get('/:id', usersController.getUserDetails);
router.post('/:id/update', usersController.updateUserDetails);

// Other routes...
module.exports = router;