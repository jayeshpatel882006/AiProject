'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Protect routes — verifies JWT and attaches req.user
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('No token provided. Please log in.'));
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Session expired. Please log in again.'));
      }
      return next(ApiError.unauthorized('Invalid token. Please log in again.'));
    }

    // 3. Fetch user from DB
    const user = await User.findById(decoded.id).select('+tokenVersion');
    if (!user) {
      return next(ApiError.unauthorized('User no longer exists.'));
    }

    // 4. Check if user is active
    if (!user.isActive) {
      return next(ApiError.forbidden('Your account has been deactivated.'));
    }

    // 5. Validate token version (handles logout-all / password change invalidation)
    if (decoded.tokenVersion !== user.tokenVersion) {
      return next(ApiError.unauthorized('Session invalidated. Please log in again.'));
    }

    // 6. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    next(ApiError.internal());
  }
};

/**
 * Restrict access to specific roles
 * Usage: restrictTo('admin')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action.'));
    }
    next();
  };
};

module.exports = { protect, restrictTo };
