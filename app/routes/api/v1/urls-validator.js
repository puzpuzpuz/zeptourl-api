'use strict'

const errors = require('../../../errors')
const validator = require('validator')

function validateFindUrl (req, res, next) {
  const zUrl = req.params.zUrl
  if (!validator.isLength(zUrl, { min: 0, max: 1024 })) {
    return next(new errors.ValidationError('zURL with an invalid length was provided.'))
  }
  next()
}

function validateGenerateUrl (req, res, next) {
  const bodyKeys = Object.keys(req.body)
  if (bodyKeys.length !== 1 || bodyKeys[0] !== 'url') {
    return next(new errors.ValidationError('Invalid request body: wrong fields provided.'))
  }
  const url = req.body.url
  if (url && !validator.isURL(url)) {
    return next(new errors.ValidationError('Invalid request body: invalid URL provided.'))
  }
  next()
}

module.exports = {
  validateFindUrl,
  validateGenerateUrl
}
