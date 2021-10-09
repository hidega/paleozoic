'use strict'

var commons = require('../commons')

module.exports = p => {
  commons.assert(p.cfg.socket || (p.cfg.port && p.cfg.host), 1060)
  if (p.cfg.socket) {
    p.cfgBuilder.addMariadbOpt('socket', p.cfg.socket)
  } else {
    p.cfgBuilder.addMariadbOpt('port', p.cfg.port)
    p.cfgBuilder.addMariadbOpt('bind-address', p.cfg.host)
  }
  return p
}
