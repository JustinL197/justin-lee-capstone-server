// src/controllers/usersController.js
const knex = require('knex')(require('../../knexfile')['development']);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, username } = req.body;

    // Check if the email already exists
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      username
    };
    await knex('users').insert(newUser);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //check if user exist
        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(400).json({ error: 'invalid email or password'});
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({ error: 'Invalid email or password' });
        }

         // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
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