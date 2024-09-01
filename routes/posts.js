const express = require('express');
const router = express.Router();
const postsController = require('../controllers/post-controller');

router.post('/posts', postsController.createPost);

// Other routes...
module.exports = router;