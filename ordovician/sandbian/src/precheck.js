var os = require('os')

var platformOk = 'linux' === os.platform()

var precheck = () => {
  var result = Promise.resolve(0)
  if(!platformOk) {
    result = Promise.reject('This program runs only on Linux')
  }
  return result
}

module.exports = precheck

