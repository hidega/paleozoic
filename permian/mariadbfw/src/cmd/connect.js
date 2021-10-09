'use strict'

var mariadb = require('mariadb')
var commons = require('../commons')

module.exports = (p, cfg) => {
  var params = p || {}
  var opts = { database: params.database || 'test' }

  var handleSsl = () => {
    let result
    if (cfg.ssl) {
      opts.ssl = { rejectUnauthorized: false }
      result = cfg.ssl.acceptUnauthorized ? Promise.resolve() : commons.fs.readFile(cfg.ssl.serverCertFile, 'utf8').then(serverCert => opts.ssl = { ca: serverCert })
    } else {
      result = Promise.resolve()
    }
    return result
  }

  return handleSsl().then(() => {
    if (cfg.socket) {
      opts.socketPath = cfg.socket
    } else {
      opts.host = cfg.host
      opts.port = cfg.port
    }
    if (params.user) {
      opts.user = params.user
      opts.password = params.password
    }
    return mariadb.createConnection(opts)
  })
}
