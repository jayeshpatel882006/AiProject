'use strict';

const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Central error handling middleware.
 * Must be registered LAST in Express middleware chain.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // ── express-validator errors ─────────────────────────────────────────────
  // (Handled inline via validate() helper; this is a safety fallback)

  // ── Mongoose CastError (invalid ObjectId) ────────────────────────────────
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid value for field: ${err.path}`);
  }

  // ── Mongoose Duplicate Key ────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
    );
  }

  // ── Mongoose Validation Error ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest('Validation failed', messages);
  }

  // ── JWT Errors ────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token.');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired.');
  }

  // ── Default to 500 if not an operational error ────────────────────────────
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong. Please try again.';

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode}`, {
      message: err.message,
      stack: err.stack,
      body: req.body,
      user: req.user?._id,
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} - ${statusCode}: ${message}`);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors?.length ? error.errors : undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 handler — catches requests to undefined routes.
 */
const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Inline validation runner — call after express-validator chains.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(ApiError.badRequest('Validation failed', messages));
  }
  next();
};

module.exports = { errorHandler, notFound, validate };
