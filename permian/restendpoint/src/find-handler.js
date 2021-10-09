var commons = require('./commons')

module.exports = (handlers, path, result = { handler: false }) => {
  path.find((e, n) => commons.when(commons.isFunction(handlers = handlers[e]))
    .then(() => {
      result.handler = handlers
      result.pos = n
      return true
    })
    .otherwise(() => !handlers))
  return result
}
