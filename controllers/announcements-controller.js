const knex = require('knex')(require('../knexfile')['development']);

exports.getAllAnnouncements= async (req, res) => {
    try{
        const announcements = await knex('announcements').select('*');
        res.status(200).json(announcements);
    }catch(error){
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
}

exports.createAnnouncement = async (req, res) => {
    try {
        const { id: user_id, role } = req.user;
        const { topic, title, message } = req.body;

        if (role !== 1) {
            return res.status(403).json({ error: 'Only faculty members can post announcements' });
        }

        if (topic.length > 255) {
            return res.status(400).json({ error: 'Topic is too long, must be 255 characters or fewer.' });
        }

        if (!topic || !title || !message) {
            return res.status(400).json({ error: 'Topic, title, and message are required.' });
        }

        const previewLength = 80;
        const preview = message.length > previewLength ? message.substring(0, previewLength) + '...' : message;

        const newAnnouncement = {
            user_id,
            topic,
            title,
            message,
            preview,
            vote_count: 0,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        };

        const [insertedAnnouncementId] = await knex('announcements').insert(newAnnouncement).returning('id');
        const insertedAnnouncement = await knex('announcements').where({ id: insertedAnnouncementId }).first();

        res.status(201).json(insertedAnnouncement); // Return the newly created announcement
    } catch (error) {
        console.error('Error posting announcement:', error);
        res.status(500).json({ error: 'Failed to post announcement' });
    }
};

  exports.upvoteAnnouncement = async (req, res) => {
    try {
      const { id } = req.params;
  
      const announcement = await knex('announcements').where('id', id).first();
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
  
      // Increment the vote count
      await knex('announcements').where('id', id).increment('vote_count', 1);
  
      res.status(200).json({ message: 'Upvoted successfully' });
    } catch (error) {
      console.error('Error upvoting announcement:', error);
      res.status(500).json({ error: 'Failed to upvote announcement' });
    }
  };
  
  exports.downvoteAnnouncement = async (req, res) => {
    try {
      const { id } = req.params;
  
      const announcement = await knex('announcements').where('id', id).first();
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
  
      await knex('announcements').where('id', id).decrement('vote_count', 1);
  
      res.status(200).json({ message: 'Downvoted successfully' });
    } catch (error) {
      console.error('Error downvoting announcement:', error);
      res.status(500).json({ error: 'Failed to downvote announcement' });
    }
  };
  
  exports.neutralVoteAnnouncement = async (req, res) => {
    try {
      const { id } = req.params;
      const { previousVote } = req.body;
  
      const announcement = await knex('announcements').where('id', id).first();
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
  
      if (previousVote === 'upvoted') {
        await knex('announcements').where('id', id).decrement('vote_count', 1);
      } else if (previousVote === 'downvoted') {
        await knex('announcements').where('id', id).increment('vote_count', 1);
      }
  
      res.status(200).json({ message: 'Vote reset to neutral successfully' });
    } catch (error) {
      console.error('Error resetting vote to neutral:', error);
      res.status(500).json({ error: 'Failed to reset vote to neutral' });
    }
  };

  exports.deleteAnnouncement = async (req, res) => {
    const { id } = req.params;
  
    try {
      const announcement = await knex('announcements').where({ id }).first();
      
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
  
      if (announcement.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You do not have permission to delete this announcement' });
      }
  
      await knex('announcements').where({ id }).del();
  
      res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ error: 'Failed to delete announcement' });
    }
  };

  exports.updateAnnouncement = async (req, res) => {
    const { id } = req.params; // Get the announcement ID from the route parameter
    const { topic, title, message } = req.body; // Get the updated fields from the request body
    const { id: user_id, role } = req.user; // Get user ID and role from the authenticated user
  
    try {
      // Check if the announcement exists
      const announcement = await knex('announcements').where({ id }).first();
  
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
  
      // Check if the authenticated user is the creator of the announcement
      if (announcement.user_id !== user_id) {
        return res.status(403).json({ error: 'You do not have permission to edit this announcement' });
      }
  
      // Validate the input fields
      if (!topic || !title || !message) {
        return res.status(400).json({ error: 'Topic, title, and message are required.' });
      }
  
      if (topic.length > 255) {
        return res.status(400).json({ error: 'Topic is too long, must be 255 characters or fewer.' });
      }
  
      const previewLength = 80;
      const preview = message.length > previewLength ? message.substring(0, previewLength) + '...' : message;
  
      // Update the announcement in the database
      await knex('announcements')
        .where({ id })
        .update({
          topic,
          title,
          message,
          preview,
          updated_at: knex.fn.now(),
        });
  
      // Fetch the updated announcement
      const updatedAnnouncement = await knex('announcements').where({ id }).first();
  
      res.status(200).json(updatedAnnouncement); // Return the updated announcement
    } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(500).json({ error: 'Failed to update announcement' });
    }
  };