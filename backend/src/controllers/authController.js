'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../config/logger');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sign a JWT for a user
 */
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Build and send the auth token response
 */
const sendAuthResponse = (res, statusCode, user, message) => {
  const token = signToken(user);

  // Strip sensitive fields before sending
  const userData = user.toJSON();

  return res.status(statusCode).json(
    new ApiResponse(statusCode, { token, user: userData }, message)
  );
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(ApiError.conflict('An account with this email already exists.'));
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    logger.info(`New user registered: ${user.email} [${user._id}]`);

    sendAuthResponse(res, 201, user, 'Account created successfully. Welcome aboard!');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user with password field (excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      // Deliberate generic message to prevent email enumeration
      return next(ApiError.unauthorized('Invalid email or password.'));
    }

    if (!user.isActive) {
      return next(ApiError.forbidden('Your account has been deactivated. Contact support.'));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged in: ${user.email} [${user._id}]`);

    sendAuthResponse(res, 200, user, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me  (protected)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(ApiError.notFound('User not found.'));

    res.status(200).json(new ApiResponse(200, { user }, 'User profile retrieved.'));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout  (protected)
 * Invalidates ALL existing tokens by bumping tokenVersion
 */
const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
    logger.info(`User logged out: ${req.user.email} [${req.user._id}]`);
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/auth/change-password  (protected)
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return next(ApiError.unauthorized('Current password is incorrect.'));
    }

    user.password = newPassword;
    user.tokenVersion += 1; // Invalidate all other sessions
    await user.save();

    logger.info(`Password changed for user: ${user.email} [${user._id}]`);

    sendAuthResponse(res, 200, user, 'Password changed successfully. Please log in again on other devices.');
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe, logout, changePassword };
