'use strict'

const logger = require('../utils/logger').app
const dbClient = require('../utils/cassandra-client')

module.exports = async () => {
  logger.info('Connecting to Cassandra: started')
  await dbClient.connect()
  logger.info('Connecting to Cassandra: done')
}
