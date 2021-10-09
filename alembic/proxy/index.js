var {healthcheck} = require('@permian/proxy')
var contract = require('@devonian/deployment-contract')
var deployment = require('@alembic/deployment')
var startProxy = require('./start-proxy')

var cmd = process.argv[1]

var baseProxyOptions = {
  mode: 'https',
  boundIp: deployment.proxy.internalIp,
  port: deployment.proxy.publicPort,
  redirectionTable: [
    {
      selector: deployment.fileServer.proxySelector,
      hosts: [deployment.fileServer.internalIp],
      port: deployment.fileserver.internalPort
    }
  ],
  pingPath: contract.proxy.pingPath,
  incomingRequestTimeoutMs: 10000,
  outgoingRequestTimeoutMs: 10000
}

if (contract.START_CMD === cmd) {
  startProxy(baseProxyOptions)
} else if (contract.HEALTHCHECK_CMD === cmd) {
  healthcheck(baseProxyOptions, err => process.exit(err ? 1 : 0))
} else {
  console.error('unknown command: ' + cmd)
  process.exit(2)
}
