'use strict'

const config = require('../utils/config')
const logger = require('../utils/logger').app
const dbClient = require('../utils/cassandra-client')

module.exports = async () => {
  logger.info('Connecting to Cassandra: config\n%o', config.get('cassandra'))
  await dbClient.connect()
  logger.info('Connecting to Cassandra: success')
}
