'use strict'

const logger = require('../utils/logger').app
const routes = require('../routes')

module.exports = async app => {
  logger.info('Setup routes: started')
  routes.createRoutes(app.route)
  logger.info('Setup routes: done')
}
