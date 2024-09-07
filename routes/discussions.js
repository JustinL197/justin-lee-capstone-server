const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const discussionsController = require('../controllers/discussions-contoller');

// Post a new discussion
router.post('/', authenticateUser, discussionsController.createDiscussion);

// Edit a discussion post (only by the post owner)
router.put('/:id', authenticateUser, discussionsController.editDiscussion);

// Delete a discussion post (only by the post owner)
router.delete('/:id', authenticateUser, discussionsController.deleteDiscussion);

// Get all discussion posts

router.get('/', authenticateUser, discussionsController.getAllDiscussions);
router.get('/:id', authenticateUser, discussionsController.getDiscussionById);

router.post('/:id/like', discussionsController.toggleLike);


//comments related:
router.get('/:id/comments', authenticateUser, discussionsController.getCommentsForDiscussion);
router.post('/:id/comments', authenticateUser, discussionsController.postComment);

router.get('/comments/:id', authenticateUser, discussionsController.getCommentById);

// Delete a comment (ensure discussion_id is passed as a query param)
router.delete('/comments/:id', authenticateUser, discussionsController.deleteComment);

// Like a comment (liking functionality)
router.post('/comments/:id/like', authenticateUser, discussionsController.toggleLikeComment);

module.exports = router;