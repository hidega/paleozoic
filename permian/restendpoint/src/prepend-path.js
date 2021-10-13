var commons = require('./commons')
var http = require('./http')

var toArray = commons.whenBuilder().then(p => p).otherwise(p => p.split('/')).build()

var preparePath = path => toArray(Array.isArray(path), path).filter(e => e.length > 0)

var prepend = (method, obj, p) => p.reverse().concat(method).reduce((acc, p) => ({ [p]: acc }), obj)

var prependPath = commons.whenBuilder()
  .then(p => http.ALLOWED_METHODS.reduce((acc, m) => {
    p.handlers[m] && Object.assign(acc, prepend(m, p.handlers[m], Object.assign([], p.path)), {})
    return acc
  }, {}))
  .otherwise(p => p.handlers)
  .build()

module.exports = (p, handlers, path = preparePath(p)) => prependPath(path.length > 0, { handlers, path })
