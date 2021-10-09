var util = require('util')
var _ = require('./lodash')

module.exports = {
  promisifyIfNoCallback0: f => {
    var p = util.promisify(f)
    return callback => callback ? f(callback) : p()
  },
  promisifyIfNoCallback1: f => {
    var p = util.promisify(f)
    return (a, callback) => callback ? f(a, callback) : p(a)
  },
  promisifyIfNoCallback2: f => {
    var p = util.promisify(f)
    return (a, b, callback) => callback ? f(a, b, callback) : p(a, b)
  },
  promisifyIfNoCallback3: f => {
    var p = util.promisify(f)
    return (a, b, c, callback) => callback ? f(a, b, c, callback) : p(a, b, c)
  },
  extractParamsAndCallback1: (p, c) => {
    var parameters = {}
    var callback = () => {}
    if (_.isFunction(p)) {
      if (_.isFunction(c)) {
        parameters = p
        callback = c
      } else {
        callback = p
      }
    } else {
      if (_.isFunction(c)) {
        parameters = p
        callback = c
      } else {
        parameters = p
      }
    }
    if (!parameters && parameters !== '') {
      parameters = {}
    }
    return { parameters, callback }
  }
}
