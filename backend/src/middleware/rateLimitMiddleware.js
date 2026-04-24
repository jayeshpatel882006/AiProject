'use strict';

const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 min

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(ApiError.tooManyRequests('Too many requests. Please try again later.'));
  },
});

/**
 * Strict limiter for auth endpoints (prevents brute-force)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Increased for development
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts. Please try again in 15 minutes.',
  handler: (req, res, next) => {
    next(ApiError.tooManyRequests('Too many authentication attempts. Please try again later.'));
  },
});

/**
 * AI endpoint limiter (more restrictive — costs money)
 */
const aiLimiter = rateLimit({
  windowMs,
  max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 50, // Increased for development
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      ApiError.tooManyRequests(
        'AI request limit reached. Please wait before sending more requests.'
      )
    );
  },
});

module.exports = { apiLimiter, authLimiter, aiLimiter };
