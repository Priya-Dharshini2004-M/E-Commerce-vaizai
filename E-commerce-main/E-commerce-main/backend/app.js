const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));   // ← Must be exactly this
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Base route
app.get('/', (req, res) => {
  res.send('Multi-Vendor API running');
});

// TEMPORARY TEST ROUTE - remove later
app.get('/test', (req, res) => {
    res.json({ message: 'Server is alive' });
  });

// Error handler (must be last)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const { protect } = require('./middleware/authMiddleware');

app.get('/auth-test', protect, (req, res) => {
  res.json({ message: 'Auth works', user: req.user });
});

// Seed route (temporary, only for development)
app.use('/api/seed', require('./routes/seedRoutes'));

module.exports = app;