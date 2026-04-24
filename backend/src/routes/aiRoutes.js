'use strict';

const { Router } = require('express');
const { body, query, param } = require('express-validator');
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/errorMiddleware');
const { aiLimiter } = require('../middleware/rateLimitMiddleware');

const router = Router();

// All AI routes are protected
router.use(protect);

// ─── Validation Rules ─────────────────────────────────────────────────────────

const chatValidation = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ max: 4000 }).withMessage('Message cannot exceed 4,000 characters.'),
  body('history')
    .optional()
    .isArray({ max: 50 }).withMessage('History must be an array of up to 50 messages.'),
  body('history.*.role')
    .optional()
    .isIn(['user', 'assistant']).withMessage('History role must be "user" or "assistant".'),
  body('history.*.content')
    .optional()
    .isString().notEmpty().withMessage('History content must be a non-empty string.'),
];

const summarizeValidation = [
  body('text')
    .trim()
    .notEmpty().withMessage('Text is required.')
    .isLength({ min: 50 }).withMessage('Text must be at least 50 characters to summarize.')
    .isLength({ max: 8000 }).withMessage('Text cannot exceed 8,000 characters.'),
  body('style')
    .optional()
    .isIn(['concise', 'detailed', 'bullet']).withMessage('Style must be: concise, detailed, or bullet.'),
];

const generateValidation = [
  body('topic')
    .trim()
    .notEmpty().withMessage('Topic is required.')
    .isLength({ max: 500 }).withMessage('Topic cannot exceed 500 characters.'),
  body('contentType')
    .optional()
    .isIn(['blog', 'email', 'social', 'ad', 'product'])
    .withMessage('contentType must be: blog, email, social, ad, or product.'),
  body('tone')
    .optional()
    .isIn(['professional', 'casual', 'humorous', 'formal'])
    .withMessage('tone must be: professional, casual, humorous, or formal.'),
];

const historyQueryValidation = [
  query('type').optional().isIn(['chat', 'summarize', 'generate']).withMessage('Invalid history type.'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50.'),
];

const historyIdValidation = [
  param('id').isMongoId().withMessage('Invalid history record ID.'),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/ai/chat
 * @desc    Multi-turn AI chat
 * @access  Private
 */
router.post('/chat', aiLimiter, chatValidation, validate, aiController.chat);

/**
 * @route   POST /api/ai/summarize
 * @desc    Summarize provided text
 * @access  Private
 */
router.post('/summarize', aiLimiter, summarizeValidation, validate, aiController.summarize);

/**
 * @route   POST /api/ai/generate
 * @desc    Generate content by topic, type, and tone
 * @access  Private
 */
router.post('/generate', aiLimiter, generateValidation, validate, aiController.generate);

/**
 * @route   GET /api/ai/history
 * @desc    Get paginated AI interaction history
 * @access  Private
 */
router.get('/history', historyQueryValidation, validate, aiController.getHistory);

/**
 * @route   DELETE /api/ai/history
 * @desc    Clear all history (optionally filtered by type)
 * @access  Private
 */
router.delete('/history', historyQueryValidation, validate, aiController.clearHistory);

/**
 * @route   DELETE /api/ai/history/:id
 * @desc    Delete a single history record
 * @access  Private
 */
router.delete('/history/:id', historyIdValidation, validate, aiController.deleteHistoryRecord);

module.exports = router;
