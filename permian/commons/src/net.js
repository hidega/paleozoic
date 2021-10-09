var checkSocket = require('./check-socket')
var query = require('@permian/query')

module.exports = Object.freeze({
  checkSocket,
  maxRequestUrlLength: 1999,
  checkIfPortIsReachable: (host, port, timeoutMs, callback) => checkSocket(host, port, false, timeoutMs, callback),
  checkIfSocketIsReachable: (socketName, timeoutMs, callback) => checkSocket(false, false, socketName, timeoutMs, callback),
  http: query.http,
  https: query.https
})
