// // backend/src/middleware/auth.middleware.js
// const jwt = require('jsonwebtoken');

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.accessToken; // Make sure this matches your cookie name
    
//     if (!token) {
//       return res.status(401).json({ 
//         message: 'Authentication required',
//         code: 'TOKEN_MISSING'
//       });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = { userId: decoded.userId }; // Ensure userId is set correctly
//       console.log('Authenticated user:', req.user); // Add logging
//       next();
//     } catch (error) {
//       if (error.name === 'TokenExpiredError') {
//         return res.status(401).json({ 
//           message: 'Token expired',
//           code: 'TOKEN_EXPIRED'
//         });
//       }
//       throw error;
//     }
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(401).json({ 
//       message: 'Invalid token',
//       code: 'TOKEN_INVALID'
//     });
//   }
// };

// module.exports = authMiddleware;


// backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  // Skip authentication for login and register routes
  if (req.path.includes('/api/auth/login') || 
      req.path.includes('/api/auth/register')) {
    return next();
  }

  try {
    const token = req.cookies.accessToken;
    
    if (!token) {
      // Try refresh token if access token is missing
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        try {
          const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
          // Generate new access token
          const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
          );
          
          // Set new access token cookie
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 15 * 60 * 1000
          });
          
          req.user = { userId: decoded.userId };
          return next();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'TOKEN_MISSING'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Invalid token',
      code: 'TOKEN_INVALID'
    });
  }
};

module.exports = authMiddleware;
