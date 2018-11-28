'use strict'

const logger = require('../utils/logger').app
const config = require('../utils/config').get('express')
const middlewares = require('../utils/middlewares')
const express = require('express')
const expressWinston = require('express-winston')
const cors = require('cors')

module.exports = async app => {
  logger.info('Setup Express middlewares: started', config)

  // disable x-powered-by header
  app.disable('x-powered-by')

  // common middlewares
  app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: false,
    msg: '{{req.method}} {{req.url}} {{res.statusCode}} - {{res.responseTime}} ms'
  }))

  // restrict supported content-types
  app.use(middlewares.contentTypeLimiter({
    methods: ['POST', 'PUT'],
    types: ['application/json']
  }))

  // body parser
  app.use(express.json({ limit: config.limit }))

  // cors setup
  app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }))

  // routes will be set up on the next phase
  app.route = express.Router()
  app.use(app.route)

  app.use(middlewares.notFoundHandler)
  app.use(middlewares.errorHandler)

  logger.info('Setup Express middlewares: done')
}
