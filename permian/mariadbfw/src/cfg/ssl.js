'use strict'

var commons = require('../commons')

var validate = cfg => {
  commons.assert(cfg, 1030)
  commons.assert(cfg.serverCertFile, 1031)
  commons.assert(cfg.serverKeyFile, 1032)
  commons.assert(cfg.serverCaFile, 1033)
}

module.exports = p => {
  if (p.cfg.ssl) {
    validate(p.cfg.ssl)
    p.cfgBuilder.addMariadbOpt('ssl-cert', p.cfg.ssl.serverCertFile)
    p.cfgBuilder.addMariadbOpt('ssl-key', p.cfg.ssl.serverKeyFile)
    p.cfgBuilder.addMariadbOpt('ssl-ca', p.cfg.ssl.serverCaFile)
    p.cfg.ssl.clientCertFile && p.cfgBuilder.addClientOpt('ssl-cert', p.cfg.ssl.clientCertFile)
    p.cfg.ssl.clientKeyFile && p.cfgBuilder.addClientOpt('ssl-key', p.cfg.ssl.clientKeyFile)
    p.cfg.ssl.clientCaFile && p.cfgBuilder.addClientOpt('ssl-ca', p.cfg.ssl.clientCaFile)
  }
  return p
}
