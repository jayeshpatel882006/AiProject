'use strict';

const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/errorMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

const router = Router();

// ─── Validation Rules ─────────────────────────────────────────────────────────

const signupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.'),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', authLimiter, signupValidation, validate, authController.signup);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post('/login', authLimiter, loginValidation, validate, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user profile
 * @access  Private
 */
router.get('/me', protect, authController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Invalidate all tokens for the user
 * @access  Private
 */
router.post('/logout', protect, authController.logout);

/**
 * @route   PATCH /api/auth/change-password
 * @desc    Change authenticated user's password
 * @access  Private
 */
router.patch('/change-password', protect, changePasswordValidation, validate, authController.changePassword);

module.exports = router;
