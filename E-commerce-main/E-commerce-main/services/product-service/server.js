const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const connectDB = require('./config/db');

dotenv.config();

// Winston Logger
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

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/products', require('./routes/productRoutes'));

// Database Seeder routes (mounted directly to /api/seed in this microservice)
const User = require('./models/Product'); // To resolve validation if needed
app.use('/api/seed', require('./routes/seedRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Product Service Running' });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  logger.info(`Product Service listening on port ${PORT}`);
});
