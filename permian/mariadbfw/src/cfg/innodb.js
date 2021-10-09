'use strict'

var commons = require('../commons')

var validate = cfg => {
  commons.assert(cfg.bufferPoolSize, 1040)
}

module.exports = p => {
  if (p.cfg.innoDb) {
    validate(p.cfg.innoDb)
    p.cfgBuilder.addMariadbOpt('innodb_buffer_pool_size', p.cfg.inooDb.bufferPoolSize)
  }
  return p
}
