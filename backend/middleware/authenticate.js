const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. Missing or malformed token.' });
    }

    const token = authHeader.split(' ')[1].trim(); // Trim any extra whitespace
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token not found.' });
    }

    // Ensure that JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in the environment variables.'); // Log for debugging
      return res.status(500).json({ message: 'Server configuration issue. Missing JWT_SECRET.' });
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id; // Attach the user ID to the request
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    } else if (err instanceof jwt.NotBeforeError) {
      return res.status(401).json({ message: 'Token not yet valid. Please check your system clock.' });
    } else {
      console.error('Authentication error:', err); // Log unexpected errors for debugging
      return res.status(500).json({ message: 'Authentication failed. Please try again.' });
    }
  }
};

module.exports = authenticate;