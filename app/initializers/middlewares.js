'use strict'

const logger = require('../utils/logger').app
const config = require('../utils/config').get('express')
const middlewares = require('../utils/middlewares')
const express = require('express')
const expressWinston = require('express-winston')
const bodyParser = require('body-parser')

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
  app.use(bodyParser.json({ limit: config.limit }))

  // CORS support TODO
  if (config.allowAllOrigins) {
    app.use(middlewares.cors)
  }

  // routes will be set up on the next phase
  app.route = express.Router()
  app.use(app.route)

  app.use(middlewares.notFoundHandler)
  app.use(middlewares.errorHandler)

  logger.info('Setup Express middlewares: done')
}
