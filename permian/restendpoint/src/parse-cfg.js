var commons = require('./commons')

var allowedParams = ['id', 'serverShutdownTimeoutMs', 'maxConnections', 'port',
  'host', 'requestTimeoutMs', 'logToStdout', 'dumpPidToFile', 'protocol']

module.exports = cfg => {
  var result = Object.assign({
    serverShutdownTimeoutMs: 1000,
    maxConnections: 32,
    port: 22333,
    host: '127.0.0.1',
    requestTimeoutMs: 2 * 1000 * 60,
    logToStdout: false,
    dumpPidToFile: false,
    id: ''
  }, cfg)
  result.protocol = 'HTTP'
  commons.hasObjectOtherKeysThan(result, allowedParams) && commons.throwError('Bad configuration property for restendpoint')
  return result
}
