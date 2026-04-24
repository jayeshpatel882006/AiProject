'use strict';

const mongoose = require('mongoose');

const HISTORY_TYPES = ['chat', 'summarize', 'generate'];

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: HISTORY_TYPES,
        message: `type must be one of: ${HISTORY_TYPES.join(', ')}`,
      },
      required: [true, 'type is required'],
    },
    prompt: {
      type: String,
      required: [true, 'prompt is required'],
      trim: true,
      maxlength: [10000, 'Prompt cannot exceed 10,000 characters'],
    },
    response: {
      type: String,
      required: [true, 'response is required'],
      trim: true,
    },
    // For chat: store the full conversation thread
    messages: {
      type: [
        {
          role: { type: String, enum: ['system', 'user', 'assistant'], required: true },
          content: { type: String, required: true },
        },
      ],
      default: undefined,
    },
    // Token usage metadata from OpenAI
    usage: {
      promptTokens: { type: Number },
      completionTokens: { type: Number },
      totalTokens: { type: Number },
    },
    model: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// ─── Compound Index ───────────────────────────────────────────────────────────
historySchema.index({ userId: 1, createdAt: -1 });
historySchema.index({ userId: 1, type: 1 });

// ─── Static Methods ───────────────────────────────────────────────────────────
/**
 * Get paginated history for a user
 */
historySchema.statics.getByUser = function (userId, { type, page = 1, limit = 20 } = {}) {
  const filter = { userId };
  if (type) filter.type = type;

  return this.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-messages -__v');
};

const History = mongoose.model('History', historySchema);

module.exports = History;
