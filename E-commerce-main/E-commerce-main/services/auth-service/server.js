const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const connectDB = require('./config/db');

dotenv.config();

// Setup Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: true, // Allow Nginx to handle CORS or allow credentials
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Auth Service Running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Auth Service listening on port ${PORT}`);
});
