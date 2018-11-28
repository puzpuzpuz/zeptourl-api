'use strict'

const logger = require('../../../utils/logger').app
const config = require('../../../utils/config').get('app')
const { InternalServerError } = require('../../../errors')
const { asyncMiddleware } = require('../../../utils/middlewares')
const { urlService } = require('../../../services')
const httpStatus = require('http-status')

async function findUrl (req, res) {
  const zUrl = req.params.zUrl
  const record = await urlService.findUrl(zUrl)
  res.json({
    zUrl: record.z_url,
    originalUrl: record.original_url
  })
}

async function generateUrl (req, res) {
  const url = req.body.url
  let zUrlCandidate

  let success = false
  let attemptCnt = 0
  while (!success && attemptCnt < config.zUrlGenRetries) {
    logger.debug('Starting zURL generation. Attempt #%s. Url: %s', attemptCnt, url)
    zUrlCandidate = await urlService.generateZUrl(config.zUrlLength)
    success = await urlService.saveUrl(zUrlCandidate, url)
    attemptCnt++
  }

  if (!success) {
    throw new InternalServerError('Failed to generate a new zURL.')
  }

  res.status(httpStatus.CREATED)
  res.json({
    zUrl: zUrlCandidate, // TODO: consider returning full URL here
    originalUrl: url
  })
}

module.exports = {
  findUrl: asyncMiddleware(findUrl),
  generateUrl: asyncMiddleware(generateUrl)
}
