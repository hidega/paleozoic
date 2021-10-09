'use strict'

var spawnCmdProcess = require('../spawn-cmd')
var AdminCmd = require('./admin')
var connect = require('./connect')

function CommandAdapter(config) {
  var cfg = Object.freeze(Object.assign({ log: {} }, config))

  this.getConfiguration = () => cfg

  var omitDefaultsFile = opts => Object.assign({ omitDefaultsFile: true }, opts)

  this.mariadbd = (args, opts) => spawnCmdProcess('mariadbd', args, cfg, opts)

  this.mariadb = (args, opts) => spawnCmdProcess('mariadb', args, cfg, opts)

  this.mariadbcheck = (args, opts) => spawnCmdProcess('mariadb-check', args, cfg, opts)

  this.mariadbdInstallDb = (args, opts) => spawnCmdProcess('mariadb-install-db', args, cfg, opts)

  this.mariadbadmin = (args, opts) => spawnCmdProcess('mariadb-admin', args, cfg, opts)

  this.checkIfDataDirIsCorrupt = opts => this.mariadbcheck(['-A'], opts)

  this.initializeDatabase = opts => this.mariadbdInstallDb(['--datadir=' + cfg.dataDir, '--user=' + CommandAdapter.Constants.MYSQL], omitDefaultsFile(opts))

  this.connect = p => connect(p, cfg)

  this.executeStatement = params => this.connect(params)
    .then(connection => connection.query(params.statement, params.values || []).then(result => connection.end().then(() => result)))

  this.pingDatabase = params => this.connect(params)
    .then(connection => connection.ping().then(r => connection.end().then(() => r)))

  AdminCmd.call(this)
}

CommandAdapter.Constants = Object.freeze({
  LOCALHOST: 'localhost',
  MYSQL: 'mysql',
  ROOT: 'root',
  LOOPBACK_IP: '127.0.0.1'
})

module.exports = CommandAdapter
