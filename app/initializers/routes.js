'use strict'

const logger = require('../utils/logger').app
const routes = require('../routes')

module.exports = async app => {
  logger.info('Add routes.')
  routes.createRoutes(app.route)
  logger.info('Add routes done.')
}
