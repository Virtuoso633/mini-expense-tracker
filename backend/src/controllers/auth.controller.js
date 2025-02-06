// /Users/sanket/Documents/mini-expense-tracker/backend/src/controllers/auth.controller.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const tokenUtil = require('../utils/token.util');

const authController = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validate input
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ 
          message: 'All fields are required' 
        });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Email already registered' 
        });
      }

      // Create new user
      const user = new User({ firstName, lastName, email, password });
      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = tokenUtil.generateTokens(user._id);
      
      // Set cookies with proper options for cross-origin
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      };

      res.cookie('accessToken', accessToken, cookieOptions);
      res.cookie('refreshToken', refreshToken, cookieOptions);

      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Registration failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Email and password are required' 
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

      const { accessToken, refreshToken } = tokenUtil.generateTokens(user._id);
      
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000
      };

      res.cookie('accessToken', accessToken, cookieOptions);
      res.cookie('refreshToken', refreshToken, cookieOptions);

      res.json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Login failed' 
      });
    }
  },

  refresh: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({ 
          success: false,
          message: 'Refresh token required' 
        });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const { accessToken, refreshToken: newRefreshToken } = tokenUtil.generateTokens(decoded.userId);
      
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000
      };

      res.cookie('accessToken', accessToken, cookieOptions);
      res.cookie('refreshToken', newRefreshToken, cookieOptions);
      
      res.json({ 
        success: true,
        message: 'Token refreshed successfully' 
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({ 
        success: false,
        message: 'Invalid refresh token' 
      });
    }
  },

  logout: async (req, res) => {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/'
    };

    res.cookie('accessToken', '', { ...cookieOptions, maxAge: 0 });
    res.cookie('refreshToken', '', { ...cookieOptions, maxAge: 0 });
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  },

  getStatus: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      res.json({ 
        success: true,
        user 
      });
    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to get user status' 
      });
    }
  }
};

module.exports = authController;
