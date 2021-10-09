var { lang } = require('@permian/commons')
var mongodbfw = require('@permian/mongodbfw')
var MessageBusClient = require('./messagebus-client')
var validatorSchema = require('./validator-schema')
var parser = require('./parameter-parser')

function Client() {}

Client.errorCodes = Object.freeze(MessageBusClient.errorCodes)

Client.constants = Object.freeze({
  TOPIC_KEY: MessageBusClient.constants.TOPIC_KEY,
  MESSAGE_KEY: MessageBusClient.constants.MESSAGE_KEY,
  maxTopicNamelength: 1024,
  minTopicNamelength: 6
})

var createParameters = (configuration, subscriptions, connector) => {
  var createMessageBusClient = collection => MessageBusClient.createInstance(collection, {
    shutdown: connector.shutdown,
    subscriptions,
    topicNameMatcher: parser.topicNameMatcher,
    onError: configuration.onError
  })
  return {
    collectionName: configuration.mqCollection,
    databaseName: configuration.database,
    createCollection: (db, cb) => db.createCollection(configuration.mqCollection, {
      validator: { $jsonSchema: validatorSchema },
      capped: true,
      size: configuration.messageQueueMaxSize
    }, cb),
    onSuccess: createMessageBusClient,
    mongodbConnector: connector
  }
}

Client.createInstance = lang.promisifyIfNoCallback2((subs, cfg, callback) => {
  var { subscriptions, configuration } = parser.parseParameters(subs, cfg)
  var connector = new mongodbfw.Connector(configuration.mongodb)
  var parameters = createParameters(subscriptions, configuration, connector)
  mongodbfw.getOrCreateCollection(parameters)
    .then(result => callback(false, result))
    .catch(e => {
      connector.shutdown()
      callback('ERR 4 -- ' + e)
    })
})

module.exports = Client
