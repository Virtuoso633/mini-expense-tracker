// backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // Make sure this matches your cookie name
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'TOKEN_MISSING'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: decoded.userId }; // Ensure userId is set correctly
      console.log('Authenticated user:', req.user); // Add logging
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Invalid token',
      code: 'TOKEN_INVALID'
    });
  }
};

module.exports = authMiddleware;
