'use strict'

const app = require('express')()
const logger = require('./utils/logger').app
const config = require('./utils/config')
const initializers = require('./initializers')

const port = config.get('express:port')

async function main () {
  // execute initializers
  await initializers.db(app)
  await initializers.middlewares(app)
  await initializers.routes(app)

  // start Express
  await new Promise((resolve, reject) =>
    app
      .listen(port, resolve)
      .on('error', reject))
}

main()
  .then(() => {
    logger.info('zeptourl-api app is listening on port', port)
  })
  .catch(error => {
    logger.error('Startup error\n%o', error)
    process.exit(1)
  })
