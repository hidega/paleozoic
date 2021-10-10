var EventEmitter = require('events')
var checkCompatibility = require('./compatibility')
var getWindow = require('./window')
var tools = require('./tools')

var eventLoop = new EventEmitter()

var createClientContext = () => getWindow()
  .then(window => checkCompatibility(window))
  .then(window => Object.freeze({
    tools: tools(window),
    eventLoop,
    getWindow: () => window,
    getDocument: () => window.document
  }))

module.exports = createClientContext
