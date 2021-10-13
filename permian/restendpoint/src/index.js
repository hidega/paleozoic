var tools = require('./tools')
var http = require('./http')
var commons = require('./commons')
var startInstance = require('./start-instance')
var prependPathToHandlers = require('./prepend-path')

module.exports = Object.freeze({
  startInstance,
  prependPathToHandlers,
  tools: Object.assign({}, tools, commons),
  http
})
