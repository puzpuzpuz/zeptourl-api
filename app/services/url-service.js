'use strict'

const logger = require('../utils/logger').service
const { NotFoundError, InternalServerError } = require('../errors')
const dbClient = require('../utils/cassandra-client')
const { types } = require('cassandra-driver')
const crypto = require('crypto')
const util = require('util')
const randomBytes = util.promisify(crypto.randomBytes)
const base32 = require('hi-base32')

/**
 * Attempts to find a zURL in the DB. Throws if a record wasn't found.
 * @param {String} zUrl
 */
async function findUrl (zUrl) {
  const query = 'SELECT z_url, original_url FROM z_urls WHERE z_url = ?'
  const result = await dbClient.execute(query, [zUrl], { prepare: true })

  if (result.rowLength === 0) {
    logger.error('URL \'%s\' was not found', zUrl)
    throw new NotFoundError('URL was not found.')
  }

  return result.rows[0]
}

/**
 * Attempts to insert a new zURL record into the DB. Insert won't happen if the DB already has
 * a record for the same zURL.
 * @param {String} zUrl minified URL
 * @param {String} originalUrl original URL
 * @returns {boolean} insert operation result (success/fail)
 */
async function saveUrl (zUrl, originalUrl) {
  const query = 'INSERT INTO z_urls (z_url, original_url, created_on) VALUES (?, ?, ?) IF NOT EXISTS'
  const params = [zUrl, originalUrl, new Date()]

  try {
    const result = await dbClient.execute(query, params, {
      consistency: types.consistencies.quorum,
      prepare: true
    })
    // return 'inserted' flag
    return result.rows[0]['[applied]']
  } catch (err) {
    logger.error('zURL \'%s\' insert failed. Reason:\n%o', zUrl, err)
    throw new InternalServerError('Persistence failure occurred.')
  }
}

/**
 * Generates a random zURL. Each zURL is a base32 string of the given length.
 * @param {Number} length zURL string length
 */
async function generateZUrl (length) {
  try {
    const bytesPerUrl = Math.floor((length * 5) / 8)
    const urlBytes = await randomBytes(bytesPerUrl)
    const urlBase32 = base32.encode(urlBytes)
    return urlBase32.replace('=', '').toLowerCase()
  } catch (err) {
    logger.error('zURL generation failed. Reason:\n%o', err)
    throw new InternalServerError('URL generation failed.')
  }
}

module.exports = {
  findUrl,
  saveUrl,
  generateZUrl
}
