const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`Auth DB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to Auth DB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
