var commons = require('./commons')
var http = require('./http')

var error = msg => () => commons.throwError(msg)

var validate = commons.matcherBuilder().all()
  .on(h => commons.isntObject(h.handlers), error('handlers is not object'))
  .on(h => h.keys.length === 0, error('handlers is empty'))
  .on(h => commons.hasObjectOtherKeysThan(h.handlers, http.ALLOWED_METHODS), error('bad HTTP method'))
  .on(h => h.keys.find(k => commons.isFunction(h.handlers[k])), error('direct handler function on HTTP method'))
  .otherwise(h => commons.cloneDeep(h.handlers))
  .build()

module.exports = handlers => validate({ handlers, keys: Object.keys(handlers) })[0]
