var commons = require('./commons')
var http = require('./http')

var toArray = path => commons.when(Array.isArray(path)).then(path).otherwise(() => path.split('/'))

var preparePath = path => toArray(path).filter(e => e.length > 0)

var prepend = (method, obj, p) => p.reverse().concat(method).reduce((acc, p) => ({
  [p]: acc
}), obj)

module.exports = (p, handlers, path = preparePath(p)) => commons.when(path.length > 0)
  .then(() => http.ALLOWED_METHODS.reduce((acc, m) => {
    handlers[m] && Object.assign(acc, prepend(m, handlers[m], Object.assign([], path)), {})
    return acc
  }, {}))
  .otherwise(handlers)
