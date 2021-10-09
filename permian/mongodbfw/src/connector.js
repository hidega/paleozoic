var mongodb = require('mongodb')
var commons = require('./commons')
var util = require('./util')
var parseConfiguration = require('./connector-cfg')

var StatusCodes = Object.freeze({
  OK: 0,
  GENERAL_ERROR: 1,
  COLLECTION_ERROR: 2,
  CONNECTION_ERROR: 3,
  DB_ERROR: 4,
  GRIDFS_ERROR: 5
})

var createError = (errorCode, errorMessage) => ({ errorCode, errorMessage })

function Connector(client, mongoUrl) {
  var shutdown = callback => {
    commons.disableDeclaredFunctions(this)
    client.close(false, err => {
      client = false
      callback(err)
    })
  }

  var getDb = databaseName => commons.try(() => client.db(databaseName), e => createError(Connector.StatusCodes.DB_ERROR, e))

  var getCollection = (collectionName, databaseName, callback) => getDb(databaseName).collection(collectionName, { strict: true }, 
    (err, collection) => err ? callback(createError(Connector.StatusCodes.COLLECTION_ERROR, err)) : callback(false, collection))

  var getGridFsBucket = databaseName => commons.try(() => new mongodb.GridFSBucket(getDb(databaseName)), e => createError(Connector.StatusCodes.GRIDFS_ERROR, e))

  var getServerStatus = (databaseName, callback) => getDb(databaseName, (err, db) => err ? callback(err) : db.admin().serverStatus(callback))

  var dropDatabase = (databaseName, callback) => getDb(databaseName, (err, db) => err ? callback(err) : db.dropDatabase({}, callback))

  var dropCollection = (collectionName, databaseName, callback) => getDb(databaseName, (err, db) => err ? callback(err) : db.dropCollection(collectionName, {}, callback))

  this.shutdown = commons.promisifyIfNoCallback0(shutdown)

  this.dropCollection = commons.promisifyIfNoCallback2(dropCollection)

  this.dropDatabase = commons.promisifyIfNoCallback1(dropDatabase)

  this.getCollection = commons.promisifyIfNoCallback2(getCollection)

  this.getServerStatus = commons.promisifyIfNoCallback1(getServerStatus)

  this.getGridFsBucket = commons.promisifyIfNoCallback1(getGridFsBucket)

  this.getClient = () => client

  this.getDb = getDb

  this.getUrl = () => mongoUrl

  this.isConnected = () => client.isConnected()
}

var createInstance = (config, callback) => {
  var configuration = parseConfiguration(config)
  var mongoUrl = util.getUrl(configuration.hosts, configuration.username, configuration.password, configuration.authDbName, configuration.replicaSetName)
  mongodb.MongoClient.connect(mongoUrl, configuration.connectOptions)
    .then(client => callback(false, new Connector(client, mongoUrl)))
    .catch(e => callback(createError(Connector.StatusCodes.CONNECTION_ERROR, e)))
}

var MongoDbConnector = {
  createInstance: commons.promisifyIfNoCallback1(createInstance),
  StatusCodes
}

module.exports = Object.freeze(MongoDbConnector)

