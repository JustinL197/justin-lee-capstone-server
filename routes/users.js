// src/routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user-controller');
const authenticateUser = require('../middleware/authenticateUser');

router.post('/register', usersController.registerUser);
router.post('/signin', usersController.signInUser);

router.get('/', usersController.getAllUsers)
// router.get('/:id', usersController.getUserDetails);
router.post('/:id/update', usersController.updateUserDetails);

router.get('/current', authenticateUser, usersController.getCurrentUser);

module.exports = router;