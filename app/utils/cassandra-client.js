'use strict'

const config = require('./config').get('cassandra')
const cassandra = require('cassandra-driver')

let contactPoints = config.contactPoints
if (!Array.isArray(contactPoints)) {
  contactPoints = [ contactPoints ]
}

const client = new cassandra.Client({
  contactPoints,
  keyspace: config.keyspace
})

module.exports = client
