var { lang, stream } = require('@permian/commons')
var mongodbfw = require('@permian/mongodbfw')

var errorCodes = {
  OK: 0,
  WARNING: -1,
  INTERNAL_ERROR: -2
}

var constants = {
  TOPIC_KEY: 'topic',
  MESSAGE_KEY: 'message'
}

var cursorOptions = {
  tailable: true,
  awaitdata: true,
  numberOfRetries: -1
}

var createStream = (cursor, parameters) => {
  var stream = cursor.stream()
  stream.on(stream.DATA, data => parameters.subscriptions[data.topic](data.message))
  stream.on(stream.ERROR, err => {
    parameters.shutdown()
    parameters.onError(err, errorCodes.INTERNAL_ERROR)
  })
  stream.on(stream.END, () => {
    parameters.shutdown()
    parameters.onError('Warning, stream was closed.', errorCodes.WARNING)
  })
  return stream
}

var createInstance = (collection, parameters) => mongodbfw.getServerDate(collection)
  .then(result => collection.find({
    $and: [
      { 
        _id: { $gt: mongodbfw.objectIdFromDate(result.localTime) } 
      }, { 
        [constants.TOPIC_KEY]: { $in: Object.keys(parameters.subscriptions) } 
      }
    ]
  }, cursorOptions))
  .then(cursor => lang.try(() => createStream(cursor, parameters),
    Promise.reject,
    stream => () => {
      stream.removeAllListeners()
      cursor.close(parameters.shutdown)
    }))
  .then(close => {
    var push = (topic, message, callback) => lang.when(parameters.topicNameMatcher.test(topic))
      .then(() => collection.insertOne({
        [constants.MESSAGE_KEY]: message,
        [constants.TOPIC_KEY]: topic
      }, callback))
      .otherwise(() => callback(errorCodes.BAD_TOPICNAME))
    return Object.freeze({ close, push: lang.promisifyIfNoCallback2(push) })
  })

module.exports = {
  errorCodes,
  constants,
  createInstance
}
