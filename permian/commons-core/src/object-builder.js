var _ = require('./lodash')

function ObjectBuilder() {
  var obj = {}
  this.add = (k, v) => {
    obj[k] = v
    return this
  }
  this.addIfNotNil = (k, v) => {
    v !== null && v !== undefined && (obj[k] = v)
    return this
  }
  this.unset = k => {
    _.unset(obj, k)
    return this
  }
  this.build = () => _.cloneDeep(obj)
}

ObjectBuilder.newInstance = () => new ObjectBuilder()

module.exports = ObjectBuilder

