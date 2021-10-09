'use strict'

var commons = require('../commons')

var validate = cfg => {
  commons.assert(cfg.dataDir, 1010)
  commons.assert(cfg.pidFilePath, 1011)
}

module.exports = p => {
  validate(p.cfg)
  p.cfgBuilder.addMariadbOpt('character-set-server', 'utf8')
  p.cfgBuilder.addMariadbOpt('datadir', p.cfg.dataDir)
  p.cfgBuilder.addMariadbOpt('pid-file', p.cfg.pidFilePath)
  p.cfgBuilder.addMariadbOpt('default-time-zone', p.cfg.defaultTimeZone || '+00:00')
  return p
}
