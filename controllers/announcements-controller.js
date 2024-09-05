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