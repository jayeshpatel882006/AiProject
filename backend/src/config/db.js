'use strict';

const mongoose = require('mongoose');
const logger = require('./logger');

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully.');
    });
  } catch (error) {
    logger.error(`MongoDB connection failed (attempt ${retryCount + 1}): ${error.message}`);

    if (retryCount < MAX_RETRIES) {
      logger.info(`Retrying connection in ${RETRY_INTERVAL_MS / 1000}s...`);
      await new Promise((res) => setTimeout(res, RETRY_INTERVAL_MS));
      return connectDB(retryCount + 1);
    }

    logger.error('Max retries reached. Exiting process.');
    process.exit(1);
  }
};

// Graceful shutdown
const disconnectDB = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed gracefully.');
};

module.exports = { connectDB, disconnectDB };
