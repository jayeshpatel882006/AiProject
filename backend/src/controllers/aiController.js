'use strict';

const openaiService = require('../services/openaiService');
const History = require('../models/History');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../config/logger');

// ─── Chat ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/ai/chat
 * Supports multi-turn conversation via optional `history` array in body.
 */
const chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user._id;

    // Build messages array: system prompt + prior history + new message
    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful, knowledgeable, and friendly AI assistant. Provide accurate, clear, and concise responses.',
      },
      ...history.map(({ role, content }) => ({ role, content })),
      { role: 'user', content: message },
    ];

    const result = await openaiService.chatCompletion(messages);

    // Append assistant reply to messages for storage
    const fullThread = [...messages, { role: 'assistant', content: result.content }];

    // Persist to history (non-blocking — fire and forget with error log)
    History.create({
      userId,
      type: 'chat',
      prompt: message,
      response: result.content,
      messages: fullThread,
      usage: result.usage,
      model: result.model,
    }).catch((err) => logger.error('Failed to save chat history:', err));

    logger.info(`Chat request by user [${userId}] — ${result.usage?.totalTokens} tokens`);

    res.status(200).json(
      new ApiResponse(200, {
        reply: result.content,
        usage: result.usage,
        model: result.model,
      }, 'Chat response generated.')
    );
  } catch (error) {
    next(error);
  }
};

// ─── Summarize ────────────────────────────────────────────────────────────────

/**
 * POST /api/ai/summarize
 */
const summarize = async (req, res, next) => {
  try {
    const { text, style = 'concise' } = req.body;
    const userId = req.user._id;

    const result = await openaiService.summarizeText(text, style);

    History.create({
      userId,
      type: 'summarize',
      prompt: text,
      response: result.content,
      usage: result.usage,
      model: result.model,
    }).catch((err) => logger.error('Failed to save summarize history:', err));

    logger.info(`Summarize request by user [${userId}] — ${result.usage?.totalTokens} tokens`);

    res.status(200).json(
      new ApiResponse(200, {
        summary: result.content,
        style,
        usage: result.usage,
        model: result.model,
      }, 'Text summarized successfully.')
    );
  } catch (error) {
    next(error);
  }
};

// ─── Generate Content ─────────────────────────────────────────────────────────

/**
 * POST /api/ai/generate
 */
const generate = async (req, res, next) => {
  try {
    const { topic, contentType = 'blog', tone = 'professional' } = req.body;
    const userId = req.user._id;

    const result = await openaiService.generateContent(topic, contentType, tone);

    History.create({
      userId,
      type: 'generate',
      prompt: `[${contentType}/${tone}] ${topic}`,
      response: result.content,
      usage: result.usage,
      model: result.model,
    }).catch((err) => logger.error('Failed to save generate history:', err));

    logger.info(`Generate request by user [${userId}] — ${result.usage?.totalTokens} tokens`);

    res.status(200).json(
      new ApiResponse(200, {
        content: result.content,
        contentType,
        tone,
        usage: result.usage,
        model: result.model,
      }, 'Content generated successfully.')
    );
  } catch (error) {
    next(error);
  }
};

// ─── History ──────────────────────────────────────────────────────────────────

/**
 * GET /api/ai/history
 * Query params: type, page, limit
 */
const getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type, page = 1, limit = 20 } = req.query;

    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit)));

    const filter = { userId };
    if (type) filter.type = type;

    const [records, total] = await Promise.all([
      History.getByUser(userId, { type, page: parsedPage, limit: parsedLimit }),
      History.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(200, {
        records,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      }, 'History retrieved successfully.')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/ai/history/:id
 */
const deleteHistoryRecord = async (req, res, next) => {
  try {
    const record = await History.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id, // Ensures ownership
    });

    if (!record) return next(ApiError.notFound('History record not found.'));

    res.status(200).json(new ApiResponse(200, null, 'History record deleted.'));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/ai/history
 * Clear all history for the authenticated user
 */
const clearHistory = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user._id };
    if (type) filter.type = type;

    const result = await History.deleteMany(filter);

    res.status(200).json(
      new ApiResponse(200, { deleted: result.deletedCount }, 'History cleared successfully.')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { chat, summarize, generate, getHistory, deleteHistoryRecord, clearHistory };
