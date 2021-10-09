var fsPromises = require('fs/promises')
var {http} = require('@permian/query')
var proxy = require('@permian/proxy')
var deployment = require('@alembic/deployment')

var POLL_INTERVAL_SEC = 10
var POLL_ATTEMPTS_COUNT = 3

var keyServerUrl = `http://${deployment.keyServer.hostname}:${deployment.keyServer.internalPort}`

var fetchSslOpts = () => http.get(`${keyServerUrl}/proxy-private-key`)
  .then(key => http.get(`${keyServerUrl}/proxy-cert`).then(cert => ({ key, cert })))

var attemptToStart = (baseProxyOptions, counter) => {
  --counter === 0 && process.exit(1)
  setTimeout(() => fetchSslOpts()
    .then(ssl => proxy.startInstance(Object.assign(baseProxyOptions, { ssl })))
    .catch(() => attemptToStart(baseProxyOptions, counter)), 
    POLL_INTERVAL_SEC * 1000)
}

var errorToFile = e => fsPromises.writeFile('./error.txt', 'Could not start proxy ' + JSON.stringify(e)) 

module.exports = baseProxyOptions => attemptToStart(baseProxyOptions, POLL_ATTEMPTS_COUNT)
  .catch(e => errorToFile(e).catch(console.error).then(() => process.exit(1)))

