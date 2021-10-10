var EventEmitter = require('events')
var checkCompatibility = require('./compatibility')
var getWindow = require('./window')
var tools = require('./tools')

var MAX_EVENT_LISTENERS = 100

var createEventLoop = () => {
  var eventLoop = new EventEmitter()
  eventLoop.setMaxListeners(MAX_EVENT_LISTENERS)
  return eventLoop
}

var waitWindowLoad = window => new Promise(resolve => window.onload = e => resolve(window, e))

var createClientContext = () => getWindow()
  .then(window => checkCompatibility(window))
  .then(waitWindowLoad)
  .then(window => Object.freeze({
    tools: tools(window),
    eventLoop: createEventLoop(),
    MAX_EVENT_LISTENERS,
    getWindow: () => window,
    getDocument: () => window.document
  }))

module.exports = createClientContext
