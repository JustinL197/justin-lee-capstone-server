const knex = require('knex')(require('../knexfile')['development']);

exports.createPost = async (req, res) => {
    try{
        
    }catch(error){
        return res.status(500).json({ error: error.message});
    }
}