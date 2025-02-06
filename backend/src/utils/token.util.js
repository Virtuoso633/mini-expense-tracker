// /Users/sanket/Documents/mini-expense-tracker/backend/src/utils/token.util.js
const jwt = require('jsonwebtoken');

const tokenUtil = {
  generateTokens: (userId) => {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Explicit time instead of env variable
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' } // Explicit time instead of env variable
    );

    return { accessToken, refreshToken };
  },

  setTokenCookies: (res, accessToken, refreshToken) => {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none', // Changed from 'strict' to allow cross-origin
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
};

module.exports = tokenUtil;
