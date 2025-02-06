# Expense Tracker Application

A full-stack expense tracking application built with React, Node.js, and MongoDB.

## Features

- 🔐 Secure JWT Authentication
- 💰 Expense Management (CRUD)
- 📊 Spending Analytics
- 📱 Responsive Design
- 🌓 Dark/Light Theme

## Technical Stack

### Frontend
- React.js
- Material-UI
- React Router
- MUI X Charts
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cookie-based token management

## Implementation Details

### JWT Authentication

The application implements a secure authentication system using:
- Access tokens (15 minutes expiry)
- Refresh tokens (7 days expiry)
- HTTP-only cookies
- Secure token rotation

Authentication flow:
1. User logs in with credentials
2. Server validates and returns tokens in HTTP-only cookies
3. Access token used for API requests
4. Refresh token automatically renews access token
5. Secure logout invalidates both tokens

### Expense Management

The expense system features:
- CRUD operations with validation
- Pagination (10 items per page)
- Filtering by:
  - Date range
  - Category
  - Amount range
- Real-time updates
- Optimistic UI updates

### Spending Insights

The analytics system provides:
- Category-wise spending distribution
- Time-based expense analysis
- Interactive charts
- Efficient data aggregation using MongoDB pipeline

## API Documentation

### Authentication Endpoints

