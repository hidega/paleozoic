var _ = require('./lodash')

var objectBuilder = {
  newInstance: () => {
    var obj = {}
    var builder = {}
    builder.add = (k, v) => {
      obj[k] = v
      return builder
    }
    builder.addIfNotNil = (k, v) => {
      v !== null && v !== undefined && (obj[k] = v)
      return builder
    }
    builder.unset = k => {
      _.unset(obj, k)
      return builder
    }
    builder.build = () => _.cloneDeep(obj)
    return builder
  }
}

module.exports = Object.freeze(objectBuilder)
