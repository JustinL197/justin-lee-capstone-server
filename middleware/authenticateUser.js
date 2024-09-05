const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers['authorization'];

  // Check if the header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded; 
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying token:', error); 
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authenticateUser;