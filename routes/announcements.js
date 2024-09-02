const express = require('express');
const router = express.Router();
const announcementsController = require('../controllers/announcements-controller');
const authenticateUser = require('../middleware/authenticateUser');

router.get('/', authenticateUser, announcementsController.getAllAnnouncements);

router.post('/', authenticateUser, announcementsController.createAnnouncement);

module.exports = router;