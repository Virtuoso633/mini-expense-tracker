// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const authRoutes = require('./routes/auth.routes');
// const expenseRoutes = require('./routes/expense.routes'); // Import expense routes

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // CORS configuration
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// // Routes
// const authRoutes = require('./routes/auth.routes');
// const expenseRoutes = require('./routes/expense.routes');

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/expenses', expenseRoutes); // Use expense routes

// // Root route
// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });

// // Database connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Expense Tracker API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message 
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Server initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});