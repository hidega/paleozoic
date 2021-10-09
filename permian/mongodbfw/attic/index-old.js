'use strict'
 
var Connector = require('./connector')
var Queries = require('./queries')
var MongoDbTools = require('./tools')
var mongodbfw = require('./base')
var parseConfiguration = require('./configuration')

var getOrCreateCollection = (parameters, callback) => parameters.mongodbConnector.getCollection(parameters.collectionName, parameters.databaseName, (err, collection) => {
  if(err && err.errorCode===Connector.StatusCodes.COLLECTION_ERROR) {
    parameters.mongodbConnector.getDb(parameters.databaseName, (err, db) => {
      if(err) {
        callback(err)
      } else {
        parameters.createCollection(db, (err, collection) => {
          if(err) {
            callback(err)
          } else {
            callback(false, parameters.onSuccess(collection))
          }
        })
      }
    })
  } else if(err) {
    callback(err)
  } else {
    callback(false, parameters.onSuccess(collection))
  }
})

mongodbfw.getOrCreateCollection = getOrCreateCollection
mongodbfw.Connector = Connector
mongodbfw.MongoDbTools = MongoDbTools
mongodbfw.Queries = Queries
mongodbfw.parseConfiguration = parseConfiguration

module.exports = Object.freeze(mongodbfw)
