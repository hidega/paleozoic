var mongodb = require('mongodb')
var commons = require('@permian/commons')
var base = require('./base')

function Connector(config) {
  var self = this

  var configuration = Object.assign({
    hosts: [{ host: 'localhost', port: 27017 }],
    username: 'mongodb',
    password: 'mongodb',
    authDbName: 'admin'
  }, config)

  configuration.connectOptions = Object.assign({ useUnifiedTopology: true }, config.connectOptions)
  configuration.connectOptions.useNewUrlParser = true

  var mongoUrl = base.getUrl(configuration.hosts, configuration.username, configuration.password, configuration.authDbName, configuration.replicaSetName)

  var client = false

  var createError = (errorCode, errorMessage) => ({ errorCode, errorMessage })

  var shutdown = callback => {
    commons.lang.disableDeclaredFunctions(self)
    if(client) {
      client.close(false, err => {
        client = false
        callback(err)
      })
      callback()
    }
  }

  var connectToClient = callback => {
    try {
      mongodb.MongoClient.connect(mongoUrl, configuration.connectOptions, (err, klient) => {
        if(err) {
          callback(createError(Connector.StatusCodes.CONNECTION_ERROR, err))
        } else {
          client = klient
          callback(false, client)
        }
      })
    } catch(e) {
      callback(createError(Connector.StatusCodes.CONNECTION_ERROR, e))
    }
  }

  var getClient = callback => {
    if(!client) {
      connectToClient(callback)
    } else if(!client.isConnected()) {
      client.close(() => connectToClient(callback))
    } else {
      callback(false, client)
    }
  }

  var getDb = (databaseName, callback) => getClient(err => {
    if(err) {
      callback(err)
    } else {
      try {
        var db = client.db(databaseName)
        callback(false, db)
      } catch(e) {
        callback(createError(Connector.StatusCodes.DB_ERROR, e))
      }
    }
  })

  var getCollection = (collectionName, databaseName, callback) => getDb(databaseName, (err, db) => {
    if(err) {
      callback(err)
    } else {
      db.collection(collectionName, { strict: true }, (err, collection) => {
        if(err) {
          callback(createError(Connector.StatusCodes.COLLECTION_ERROR, err))
        } else {
          callback(false, collection)
        }
      })
    }
  })

  var getGridFsBucket = (databaseName, callback) => getDb(databaseName, (err, db) => {
    if(err) {
      callback(err)
    } else {
      try {
        var gridFsBucket = new mongodb.GridFSBucket(db)
        callback(false, gridFsBucket)
      } catch(e) {
        callback(createError(Connector.StatusCodes.GRIDFS_ERROR, e))
      }
    }
  })

  var getServerStatus = (databaseName, callback) => getDb(databaseName, (err, db) => {
    if(err) {
      callback(err)
    } else {
      db.admin().serverStatus(callback)
    }
  })

  var dropDatabase = (databaseName, callback) => getDb(databaseName, (err, db) => {
    if(err) {
      callback(err)
    } else {
      db.dropDatabase({}, callback)
    }
  })

  var dropCollection = (collectionName, databaseName, callback) => getDb(databaseName, (err, db) => {
    if(err) {
      callback(err)
    } else {
      db.dropCollection(collectionName, {}, callback)
    }
  })

  self.getUrl = () => mongoUrl

  self.shutdown = commons.lang.promisifyIfNoCallback0(shutdown)

  self.getClient = commons.lang.promisifyIfNoCallback0(getClient)

  self.dropCollection = commons.lang.promisifyIfNoCallback2(dropCollection)

  self.dropDatabase = commons.lang.promisifyIfNoCallback1(dropDatabase)

  self.getCollection = commons.lang.promisifyIfNoCallback2(getCollection)

  self.getDb = commons.lang.promisifyIfNoCallback1(getDb)

  self.getServerStatus = commons.lang.promisifyIfNoCallback1(getServerStatus)

  self.getGridFsBucket = commons.lang.promisifyIfNoCallback1(getGridFsBucket)

  self.isConnected = () => client && client.isConnected()
}

Connector.StatusCodes = Object.freeze({
  OK: 0,
  GENERAL_ERROR: 1,
  COLLECTION_ERROR: 2,
  CONNECTION_ERROR: 3,
  DB_ERROR: 4,
  GRIDFS_ERROR: 5
})

module.exports = Connector
