// src/controllers/usersController.js
const knex = require('knex')(require('../knexfile')['development']);

// Create a new discussion
exports.createDiscussion = async (req, res) => {
  const { title, content } = req.body;
  try {
    const [newDiscussionId] = await knex('discussions').insert({
      user_id: req.user.id,  // Store the user ID for later use
      title,
      content,
      likes_count: 0,
      comment_count: 0,
    });

    // Fetch the newly created discussion and join the users table to get the username
    const newDiscussion = await knex('discussions')
      .where({ 'discussions.id': newDiscussionId })  // Fetch the inserted discussion by ID
      .join('users', 'discussions.user_id', 'users.id')  // Join with the users table using the user_id foreign key
      .select('discussions.*', 'users.username')  // Select all discussion fields and the username from the users table
      .first();

    return res.status(201).json(newDiscussion);  // Return the newly created discussion with the username
  } catch (error) {
    console.error('Error creating discussion:', error);
    return res.status(500).json({ error: 'Failed to create discussion' });
  }
};

// Edit a discussion post
exports.editDiscussion = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    // Ensure the user is the owner of the post
    const discussion = await knex('discussions').where({ id }).first();
    if (discussion.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await knex('discussions')
      .where({ id })
      .update({
        title,
        content,
        updated_at: knex.fn.now(),
      });

    // Fetch the updated discussion and join the users table to get the username
    const updatedDiscussion = await knex('discussions')
      .where({ 'discussions.id': id })
      .join('users', 'discussions.user_id', 'users.id') // Join with users table
      .select('discussions.*', 'users.username') // Select all discussion fields and the username
      .first();

    return res.status(200).json(updatedDiscussion);
  } catch (error) {
    console.error('Error editing discussion:', error);
    return res.status(500).json({ error: 'Failed to edit discussion' });
  }
};

// Delete a discussion post
exports.deleteDiscussion = async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure the user is the owner of the post
    const discussion = await knex('discussions').where({ id }).first();
    if (discussion.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await knex('discussions').where({ id }).del();
    return res.status(200).json({ message: 'Discussion deleted' });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return res.status(500).json({ error: 'Failed to delete discussion' });
  }
};

// Get all discussion posts
exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await knex('discussions')
      .join('users', 'discussions.user_id', 'users.id') // Join with users table
      .select('discussions.*', 'users.username') // Select discussion fields and username
      .orderBy('discussions.created_at', 'desc'); // Order by created date

    return res.status(200).json(discussions); // Return discussions with usernames
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return res.status(500).json({ error: 'Failed to fetch discussions' });
  }
};

// Get a specific discussion by ID
exports.getDiscussionById = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  try {
    const discussion = await knex('discussions')
      .where({ 'discussions.id': id })
      .join('users', 'discussions.user_id', 'users.id')
      .select('discussions.*', 'users.username')
      .first();
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    return res.status(200).json(discussion);
  } catch (error) {
    console.error('Error fetching discussion:', error);
    return res.status(500).json({ error: 'Failed to fetch discussion' });
  }
};

exports.toggleLike = async (req, res) => {
  const { id } = req.params;
  const { liked } = req.body;  // Get the new like status (true/false)

  try {
    // Find the discussion by ID
    const discussion = await knex('discussions').where({ id }).first();
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    // Update the likes_count based on whether the user is liking or unliking the discussion
    const updatedLikesCount = liked ? discussion.likes_count + 1 : discussion.likes_count - 1;

    // Update the likes count in the database
    await knex('discussions')
      .where({ id })
      .update({ likes_count: updatedLikesCount });

    // Return the updated likes count
    return res.status(200).json({ likes_count: updatedLikesCount });
  } catch (error) {
    console.error('Error updating like status:', error);
    return res.status(500).json({ error: 'Failed to update like status' });
  }
};

exports.getCommentsForDiscussion = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const comments = await knex('comments')
      .leftJoin('likes', function() {
        this.on('comments.id', 'likes.comment_id').andOn('likes.user_id', user_id);
      })
      .join('users', 'comments.user_id', 'users.id') // Join users table
      .select('comments.*', 'users.username', knex.raw('IF(likes.id IS NOT NULL, true, false) as isLiked')) // Add the liked status
      .where({ discussion_id: id })
      .orderBy('comments.created_at', 'asc');

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

exports.postComment = async (req, res) => {
  const { id } = req.params;  
  const { user_id, content } = req.body;

  try {
    const [newCommentId] = await knex('comments').insert({
      discussion_id: id, 
      user_id,
      content,
    });

    await knex('discussions')
      .where({ id: id })
      .increment('comment_count', 1);

    const newComment = await knex('comments')
      .where('comments.id', newCommentId)
      .join('users', 'comments.user_id', '=', 'users.id')
      .select('comments.*', 'users.username')  // Select all comment fields and the username from the users table
      .first();

    return res.status(201).json(newComment);
  } catch (error) {
    console.error('Error posting comment:', error);
    return res.status(500).json({ error: 'Failed to post comment' });
  }
};

  // Get a specific comment by ID
  exports.getCommentById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const comment = await knex('comments').where({ id }).first();
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      return res.status(200).json(comment);
    } catch (error) {
      console.error('Error fetching comment:', error);
      return res.status(500).json({ error: 'Failed to fetch comment' });
    }
  };

  exports.deleteComment = async (req, res) => {
    const { id } = req.params;  // Comment ID
    const { discussion_id } = req.body;  // Get discussion ID from the request body
  
    try {
      // Find the comment by its ID
      const comment = await knex('comments').where({ id }).first();
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      // Delete the comment
      await knex('comments').where({ id }).del();
  
      // Decrease the comment count in the discussions table
      await knex('discussions')
        .where({ id: discussion_id })
        .decrement('comment_count', 1);
  
      return res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      return res.status(500).json({ error: 'Failed to delete comment' });
    }
  };

  exports.toggleLikeComment = async (req, res) => {
    const { id: commentId } = req.params;
    const { user_id } = req.body;

    try {
        // Check if the user has already liked the comment
        const existingLike = await knex('likes')
            .where({ user_id, comment_id: commentId })
            .first();

        if (existingLike) {
            // If like exists, remove it (unlike)
            await knex('likes').where({ user_id, comment_id: commentId }).del();
            await knex('comments').where({ id: commentId }).decrement('likes_count', 1);

            return res.status(200).json({ liked: false, likes_count: (await knex('comments').where({ id: commentId }).first()).likes_count });
        } else {
            // If no like exists, add a new one
            await knex('likes').insert({ user_id, comment_id: commentId });
            await knex('comments').where({ id: commentId }).increment('likes_count', 1);

            return res.status(200).json({ liked: true, likes_count: (await knex('comments').where({ id: commentId }).first()).likes_count });
        }
    } catch (error) {
        console.error('Error toggling like for comment:', error);
        return res.status(500).json({ error: 'Failed to toggle like' });
    }
};