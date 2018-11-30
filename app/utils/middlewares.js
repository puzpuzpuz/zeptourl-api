'use strict'

const logger = require('./logger').utils
const config = require('./config')
const { NotFoundError, WrongContentTypeError } = require('../errors')
const httpStatus = require('http-status')

/**
 * Wraps an async middleware (function) into a middleware with automatic error handling.
 * @param fn async middleware (function)
 * @returns {Function} wrapped middleware
 */
function asyncMiddleware (fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next)
  }
}

/**
 * Constructs a simple middleware that restricts content types for certain HTTP methods.
 * @param {Object} options required options object
 * @param {Array.<string>} options.methods HTTP methods
 * @param {Array.<string>} options.types supported content types
 */
function contentTypeLimiter ({ methods, types }) {
  return (req, res, next) => {
    if (methods.includes(req.method) && !types.includes(req.headers['content-type'])) {
      return next(new WrongContentTypeError('Content type is not supported.'))
    }
    next()
  }
}

/**
 * Not found handling middleware.
 */
function notFoundHandler (req, res, next) {
  logger.info('Not found middleware: handling url: %s', req.url)
  next(new NotFoundError('Requested resource does not exist.'))
}

/**
 * Generic error handler. Intercepts any errors thrown by previous middlewares (e.g. by routes).
 */
function errorHandler (err, req, res, next) {
  logger.error('Error middleware: handling error\n%o', err)

  if (res.headersSent) {
    return next(err)
  }

  const errorDetails = {
    code: err.code || config.constants.errors.UNKNOWN_ERROR,
    message: err.message
  }

  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR)
  res.json(errorDetails)
}

module.exports = {
  asyncMiddleware,
  contentTypeLimiter,
  notFoundHandler,
  errorHandler
}
