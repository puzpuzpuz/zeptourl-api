'use strict'

const logger = require('../utils/logger').app
const systemInfo = require('./api/v1/system-info')
const urlsController = require('./api/v1/urls-controller')
const urlsValidator = require('./api/v1/urls-validator')

function createRoutes (app) {
  app.get('/api/v1/system-info', systemInfo.getVersion)

  app.get('/api/v1/urls/:zUrl',
    urlsValidator.validateFindUrl,
    urlsController.findUrl)
  app.post('/api/v1/urls',
    urlsValidator.validateGenerateUrl,
    urlsController.generateUrl)

  logger.info('Endpoints were registered')
}

module.exports = {
  createRoutes
}
