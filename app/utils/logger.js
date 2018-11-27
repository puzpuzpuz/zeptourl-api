'use strict'

const winston = require('winston')
const { combine, label, colorize, timestamp, splat, printf } = winston.format
const _ = require('lodash')
const config = require('./config')

const loggers = {}
_.forEach(config.get('loggers'), (val, key) => {
  winston.loggers.add(key, {
    format: combine(
      timestamp(),
      label({ label: val.label }),
      colorize(),
      splat(),
      printf((info) =>
        `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
      )
    ),
    transports: [
      new winston.transports.Console({ level: val.level })
    ]
  })
  loggers[key] = winston.loggers.get(key)
})

module.exports = loggers
