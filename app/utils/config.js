'use strict'

const path = require('path')
const nconf = require('nconf')

const constants = require(path.join(__dirname, '/../config/constants.json'))

const env = process.env.NODE_ENV || 'development'
const config = nconf
  .overrides({ express: { port: process.env.PORT } })
  .env({ parseValues: true })
  .file('environment', path.join(__dirname, `/../config/${env}.json`))
  .file('defaults', path.join(__dirname, '/../config/defaults.json'))

function get (key) {
  return config.get(key)
}

module.exports = {
  constants,
  get
}
