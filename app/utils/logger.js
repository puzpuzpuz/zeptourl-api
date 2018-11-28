'use strict'

const winston = require('winston')
const { combine, label, colorize, timestamp, splat, printf } = winston.format
const config = require('./config')

const loggers = {}
Object.entries(config.get('loggers'))
  .forEach(([name, params]) => {
    winston.loggers.add(name, {
      format: combine(
        timestamp(),
        label({ label: params.label }),
        colorize(),
        splat(),
        printf((info) =>
          `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
        )
      ),
      transports: [
        new winston.transports.Console({ level: params.level })
      ]
    })
    loggers[name] = winston.loggers.get(name)
  })

module.exports = loggers
