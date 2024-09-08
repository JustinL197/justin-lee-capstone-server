const express = require('express');
const router = express.Router();
const announcementsController = require('../controllers/announcements-controller');
const authenticateUser = require('../middleware/authenticateUser');

router.get('/', authenticateUser, announcementsController.getAllAnnouncements);

router.post('/', authenticateUser, announcementsController.createAnnouncement);
router.delete('/:id', authenticateUser, announcementsController.deleteAnnouncement);
router.put('/:id', authenticateUser, announcementsController.updateAnnouncement); 

router.post('/:id/upvote', authenticateUser, announcementsController.upvoteAnnouncement);
router.post('/:id/downvote', authenticateUser, announcementsController.downvoteAnnouncement);
router.post('/:id/neutral', authenticateUser, announcementsController.neutralVoteAnnouncement);

module.exports = router;