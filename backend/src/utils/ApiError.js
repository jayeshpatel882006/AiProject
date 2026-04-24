'use strict';

/**
 * Custom operational error class for API errors.
 * Distinguishes between programmer errors and operational errors.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // 400 Bad Request
  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  // 401 Unauthorized
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  // 403 Forbidden
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  // 404 Not Found
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  // 409 Conflict
  static conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  // 429 Too Many Requests
  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, message);
  }

  // 500 Internal Server Error
  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
