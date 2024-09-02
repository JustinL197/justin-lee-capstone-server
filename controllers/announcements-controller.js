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
      const { topic, title, preview, message } = req.body; 
  
      if (role !== 1) {
        return res.status(403).json({ error: 'Only faculty members can post announcements' });
      }
  
      if (topic.length > 255) { 
        return res.status(400).json({ error: 'Topic is too long, must be 255 characters or fewer.' });
      }

      const newAnnouncement = {
        user_id,
        topic,
        title,
        preview,
        message,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      };
  
      await knex('announcements').insert(newAnnouncement);
      res.status(201).json({ message: 'Announcement posted successfully' });
    } catch (error) {
      console.error('Error posting announcement:', error);
      res.status(500).json({ error: 'Failed to post announcement' });
    }
  };