'use strict'

var commons = require('../commons')

var validate = cfg => {
  commons.assert(cfg.logBinIndex, 1020)
  commons.assert(cfg.serverId, 1021)
  commons.assert(cfg.replicateDoDb, 1022)
}

module.exports = p => {
  if (p.cfg.replication) {
    validate(p.cfg.replication)
    p.cfg.log = Object.assign(p.cfg.log, {
      logBin: 'ON',
      logBinFormat: 'mixed',
      logBinIndex: p.cfg.replication.logBinIndex
    })
    p.cfgBuilder.addMariadbOpt('server-id', p.cfg.replication.serverId)
    p.cfgBuilder.addMariadbOpt('replicate-do-db', p.cfg.replication.replicateDoDb)
  }
  return p
}
