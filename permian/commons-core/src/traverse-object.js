var _ = require('./lodash')

module.exports = (origObj, f, maxDepth) => {
  maxDepth ??= 100
  var g = (obj, parent, key, depth) => {
    if (depth++ > maxDepth) {
      throw new Error('Max depth reached: ' + maxDepth)
    }
    if (_.isArray(obj)) {
      obj.forEach((e, n) => g(e, obj, n, depth))
      f({ leaf: _.isEmpty(obj), obj, parent, key, depth })
    } else if (_.isObject(obj)) {
      Object.keys(obj).forEach(key => g(obj[key], obj, key, depth))
      f({ leaf: _.isEmpty(obj), obj, parent, key, depth })
    } else {
      f({ leaf: true, obj, parent, key, depth })
    }
  }
  g(origObj, null, null, -1)
}

