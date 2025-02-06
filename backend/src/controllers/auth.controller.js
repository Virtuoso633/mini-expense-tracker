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
      
      // Set cookies
      tokenUtil.setTokenCookies(res, accessToken, refreshToken);

      res.status(201).json({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Email and password are required' 
        });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = tokenUtil.generateTokens(user._id);
      
      // Set cookies
      tokenUtil.setTokenCookies(res, accessToken, refreshToken);

      res.json({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  refresh: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({ 
          message: 'Refresh token required' 
        });
      }

      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const { accessToken, refreshToken: newRefreshToken } = tokenUtil.generateTokens(decoded.userId);
        
        tokenUtil.setTokenCookies(res, accessToken, newRefreshToken);
        
        res.json({ message: 'Token refreshed successfully' });
      } catch (error) {
        res.status(401).json({ 
          message: 'Invalid refresh token' 
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  logout: async (req, res) => {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
    res.json({ message: 'Logged out successfully' });
  },

  getStatus: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId)
        .select('-password');
      
      if (!user) {
        return res.status(404).json({ 
          message: 'User not found' 
        });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController;
