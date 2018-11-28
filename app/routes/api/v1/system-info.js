'use strict'

const path = require('path')

const appRoot = path.dirname(require.main.filename)
const version = require(appRoot + '/../package.json').version

function getVersion (req, res) {
  res.json({
    version: version
  })
}

module.exports = {
  getVersion
}
