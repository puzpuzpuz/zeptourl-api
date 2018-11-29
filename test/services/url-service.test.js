/* global jest, describe, test, expect */
'use strict'

jest.mock('../../app/utils/cassandra-client')
const dbClient = require('../../app/utils/cassandra-client')

const { NotFoundError } = require('../../app/errors')
const urlService = require('../../app/services/url-service')

describe('url-service', () => {

  test('find existing zURL - should succeed', () => {
    const zUrlRec = {
      z_url: 't1e2s3t4',
      original_url: 'http://example.com'
    }
    dbClient.execute.mockResolvedValue({
      rowLength: 1,
      rows: [zUrlRec]
    })
    return urlService.findUrl('zurl')
      .then(res => expect(res).toEqual(zUrlRec))
  })

  test('find non-existing zURL - should fail', () => {
    dbClient.execute.mockResolvedValue({
      rowLength: 0,
      rows: []
    })
    return urlService.findUrl('zurl')
      .catch(e => expect(e).toBeInstanceOf(NotFoundError))
  })

})
