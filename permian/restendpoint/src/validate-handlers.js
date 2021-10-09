var commons = require('./commons')
var http = require('./http')

var error = msg => () => commons.throwError(msg)

var validate = (handlers, keys = Object.keys(handlers)) => commons.matcher().all().value(handlers)
  .on(commons.isntObject, error('handlers is not object'))
  .on(h => keys.length === 0, error('handlers is empty'))
  .on(h => commons.hasObjectOtherKeysThan(h, http.ALLOWED_METHODS), error('bad HTTP method'))
  .on(h => keys.find(k => commons.isFunction(h[k])), error('direct handler function on HTTP method'))
  .otherwise(() => commons.cloneDeep(handlers))

module.exports = handlers => validate(handlers)[0]
