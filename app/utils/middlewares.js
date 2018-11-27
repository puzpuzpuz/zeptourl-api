'use strict'

const logger = require('./logger').utils
const config = require('./config')
const errors = require('../errors')
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
 * Not found handling middleware.
 */
function notFoundHandler (req, res, next) {
  logger.info('Not found middleware: handling url: %s', req.url)
  next(new errors.NotFoundError())
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
    message: err.message,
    fields: err.fields
  }

  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR)
  res.json(errorDetails)
}

/**
 * Middleware for CORS headers support.
 */
function cors (req, res, next) {
  // TODO: insecure wildcard (use urls.baseUrl)
  res.set('Access-Control-Allow-Origin', req.get('origin') ? req.get('origin') : '*')
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, ' +
    'Pragma, Cache-Control, If-Modified-Since')
  res.set('Access-Control-Expose-Headers', 'Authorization')

  if (req.method === 'OPTIONS') {
    logger.debug('middlewares.cors -> options done')
    return res.sendStatus(httpStatus.OK)
  }

  next()
}

module.exports = {
  asyncMiddleware,
  notFoundHandler: notFoundHandler,
  errorHandler: errorHandler,
  cors: cors
}
