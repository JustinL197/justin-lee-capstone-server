// src/controllers/usersController.js
const knex = require('knex')(require('../knexfile')['development']);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
      const { first_name, last_name, email, password, username, role_id } = req.body;
  
      const errors = {};
  
      // Validate role
      const validRole = await knex('roles').where({ id: Number(role_id) }).first();
      if (!validRole) {
        errors.role_id = 'Invalid role selected';
      }
  
      // Check if the email already exists
      const existingEmail = await knex('users').where({ email }).first();
      if (existingEmail) {
        errors.email = 'Email already in use';
      }
  
      // Check if the username already exists
      const existingUsername = await knex('users').where({ username }).first();
      if (existingUsername) {
        errors.username = 'Username already in use';
      }
  
      // If there are any errors, return them all
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the new user into the database
      const newUser = {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        username,
        role_id
      };
      await knex('users').insert(newUser);
  
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

exports.signInUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        //check if user exist
        const user = await knex('users').where({ username }).first();

        if (!user) {
            return res.status(400).json({ error: 'invalid username or password'});
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({ error: 'Invalid username or password' });
        }

         // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            token,
            user: {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
            },
        });

    } catch (error){
        return res.status(500).json({ error: error.message });
    }
}

exports.getUserDetails = async (req, res) => {
    try{
        const user = await knex('users').where({ id: req.params.id }).first()
        if (!user){
            return res.status(404).json({error: `user not found`});
        }
        return res.status(200).json(user)
    }catch(error){
        return res.status(500).json({ error: error.message })
    }
}

exports.updateUserDetails = async (req, res) => {
    try{
        const { id } = req.params;
        const { first_name, last_name, username, email } = req.body;

        const user = await knex('users').where({ id }).first();
        if (!user){
            return res.status(404).json({ error: 'user not found '});
        }

        await knex('users')
            .where({ id })
            .update({
                first_name,
                last_name,
                email,
                username
            });

        const updatedUser = await knex('users').where({ id }).first()
        return res.status(200).json(updatedUser);
    }catch(error){
        return res.status(500).json({ error: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try{
        const users = await knex('users').select('*');
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({ error: 'Error retrieving users' });
    }
}