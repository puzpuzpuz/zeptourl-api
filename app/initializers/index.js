'use strict'

const db = require('./db')
const middlewares = require('./middlewares')
const routes = require('./routes')

module.exports = {
  db,
  middlewares,
  routes
}
