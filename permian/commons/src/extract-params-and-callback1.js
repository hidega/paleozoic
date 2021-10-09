var _ = require('./lodash')

module.exports = (p, c) => {
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
  return {
    parameters: parameters,
    callback: callback
  }
}
