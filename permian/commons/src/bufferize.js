var _ = require('./lodash')

module.exports = obj => {
  var result = Buffer.from([])
  if (_.isBoolean(obj)) {
    result = Buffer.from(obj ? [1] : [0])
  } else if (obj) {
    if (Buffer.isBuffer(obj)) {
      result = obj
    } else if (_.isString(obj) || _.isArray(obj)) {
      result = Buffer.from(obj)
    } else if (_.isNumber(obj)) {
      result = Buffer.from(obj.toString())
    } else if (_.isObject(obj) && (_.isFunction(obj.valueOf) || _.isFunction(obj.toPrimitive))) {
      result = Buffer.from(obj)
    }
  }
  return result
}
