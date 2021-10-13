var commons = require('./commons')

module.exports = (handlers, path, result = { handler: false }) => {
  var whenFound = n => {
    result.handler = handlers
    result.pos = n
    return true
  }
  path.find((e, n) => commons.isFunction(handlers = handlers[e]) ? whenFound(n) : !handlers)
  return result
} 
