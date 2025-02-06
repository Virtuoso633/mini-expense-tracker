const mongoose = require('mongoose');
const Expense = require('../models/expense.model');

const expenseController = {
  // Create new expense
    create: async (req, res) => {
        try {
            console.log('Received expense data:', req.body); // Add logging
            console.log('User ID from token:', req.user.userId); // Add logging
            const expense = new Expense({
                ...req.body,
                userId: req.user.userId
            });

            const savedExpense = await expense.save();
            console.log('Saved expense:', savedExpense); // Add logging

            res.status(201).json(expense);
        } catch (error) {
            console.error('Error creating expense:', error);
            // Send more specific error messages
            if (error.name === 'ValidationError') {
                return res.status(400).json({ 
                message: 'Validation error', 
                details: Object.values(error.errors).map(err => err.message)
                });
            }
            
            res.status(500).json({ 
                message: 'Failed to create expense',
                error: error.message 
            });
        }
    },

  // Get all expenses with pagination and filters
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, category, startDate, endDate } = req.query;
      const query = { userId: req.user.userId };

      if (category) {
        query.category = category;
      }

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const expenses = await Expense.find(query)
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await Expense.countDocuments(query);

      res.json({
        expenses,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get expense by ID
  getById: async (req, res) => {
    try {
      const expense = await Expense.findOne({
        _id: req.params.id,
        userId: req.user.userId
      });
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update expense
  update: async (req, res) => {
    try {
      const expense = await Expense.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
      );
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      res.json(expense);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete expense
  delete: async (req, res) => {
    try {
      const expense = await Expense.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
      });
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      res.json({ message: 'Expense deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get spending insights
  // Get spending insights
getInsights: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const query = { userId: req.user.userId };
  
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }
  
      console.log('Insights query:', query); // Debug log
  
      const insights = await Expense.aggregate([
        { 
            $match: { 
              userId: new mongoose.Types.ObjectId(req.user.userId)
            } 
        },
        {
            $group: {
              _id: '$category',
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
        },
        {
            $project: {
              category: '$_id',
              total: 1,
              count: 1
            }
        }
      ]);
  
      console.log('Insights result:', insights); // Debug log
  
      res.json(insights);
    } catch (error) {
        console.error('Error getting insights:', error);
        res.status(500).json({ message: error.message });
    }
  }
};

module.exports = expenseController;
