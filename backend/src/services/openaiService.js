'use strict';

const Groq = require('groq-sdk');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

// Singleton Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const MAX_TOKENS = parseInt(process.env.GROQ_MAX_TOKENS) || 2048;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Central Groq API error handler
 */
const handleGroqError = (error) => {
  logger.error('Groq API error:', { message: error.message, status: error.status });

  if (error.status === 401) {
    throw ApiError.internal('AI service authentication failed. Check your GROQ_API_KEY.');
  }
  if (error.status === 429) {
    throw ApiError.tooManyRequests('AI service rate limit exceeded. Please try again shortly.');
  }
  if (error.status === 503 || error.status === 500) {
    throw ApiError.internal('AI service is temporarily unavailable. Please try again.');
  }
  if (error.message?.includes('context_length')) {
    throw ApiError.badRequest('Input is too long. Please shorten your text and try again.');
  }

  throw ApiError.internal('AI request failed. Please try again.');
};

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * Chat Completion — multi-turn conversation
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<{content: string, usage: object, model: string}>}
 */
const chatCompletion = async (messages) => {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
    });

    const choice = response.choices[0];
    return {
      content: choice.message.content.trim(),
      usage: {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
      model: response.model,
    };
  } catch (error) {
    handleGroqError(error);
  }
};

/**
 * Text Summarization
 * @param {string} text
 * @param {'concise'|'detailed'|'bullet'} style
 * @returns {Promise<{content: string, usage: object, model: string}>}
 */
const summarizeText = async (text, style = 'concise') => {
  const stylePrompts = {
    concise: 'Provide a concise, 2-3 sentence summary of the following text.',
    detailed: 'Provide a detailed, comprehensive summary of the following text.',
    bullet:
      'Summarize the following text as a clear, structured bullet-point list. Use "•" for bullets.',
  };

  const systemPrompt = stylePrompts[style] || stylePrompts.concise;

  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      max_tokens: Math.min(MAX_TOKENS, 1024),
      temperature: 0.3,
    });

    const choice = response.choices[0];
    return {
      content: choice.message.content.trim(),
      usage: {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
      model: response.model,
    };
  } catch (error) {
    handleGroqError(error);
  }
};

/**
 * Content Generation
 * @param {string} topic
 * @param {'blog'|'email'|'social'|'ad'|'product'} contentType
 * @param {'professional'|'casual'|'humorous'|'formal'} tone
 * @returns {Promise<{content: string, usage: object, model: string}>}
 */
const generateContent = async (topic, contentType = 'blog', tone = 'professional') => {
  const typeTemplates = {
    blog: `Write a well-structured blog post about: "${topic}". Include an engaging introduction, key sections with subheadings, and a conclusion.`,
    email: `Write a compelling email about: "${topic}". Include a subject line, greeting, body, call-to-action, and professional sign-off.`,
    social: `Write engaging social media content (with relevant hashtags) about: "${topic}". Keep it concise and attention-grabbing.`,
    ad: `Write persuasive advertising copy for: "${topic}". Include a strong headline, key benefits, and a compelling call-to-action.`,
    product: `Write a compelling product description for: "${topic}". Highlight key features, benefits, and unique selling points.`,
  };

  const prompt = typeTemplates[contentType] || typeTemplates.blog;
  const systemPrompt = `You are an expert content writer. Write in a ${tone} tone. Always produce high-quality, engaging, and polished content.`;

  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.8,
    });

    const choice = response.choices[0];
    return {
      content: choice.message.content.trim(),
      usage: {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
      model: response.model,
    };
  } catch (error) {
    handleGroqError(error);
  }
};

module.exports = { chatCompletion, summarizeText, generateContent };
