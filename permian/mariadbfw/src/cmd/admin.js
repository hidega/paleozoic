'use strict'

var commons = require('../commons')

function AdminCmd() {
  var flushLogfile = file => commons.fs.move(commons.resolvePath(file), commons.resolvePath(file + '.old'))

  var logCfg = () => this.getConfiguration().log

  this.startServer = opts => this.mariadbd([], opts)

  this.shutdownServer = () => this.mariadbadmin(['shutdown'], { asRoot: true })

  this.pingServer = () => this.mariadbadmin(['ping'])

  this.flushErrorLog = () => logCfg().errorLogfile ? flushLogfile(logCfg().errorLogfile).then(() => this.mariadbadmin(['flush-error-log'])) : Promise.resolve()

  this.flushGeneralLog = () => logCfg().generalLogFile ? flushLogfile(logCfg().generalLogFile).then(() => this.mariadbadmin(['flush-general-log'])) : Promise.resolve()
}

module.exports = AdminCmd
