var commons = require('./commons')
var CmdAdapter = require('./cmd/adapter')

function LogfileRotator() {
  throw new Error('Cannot be instantiated')
}

LogfileRotator.lockfile = '/tmp/mariadb-logfile-rotator'

var rotateLogfile = (fileEntry, adapter, options) => commons.fs.stat(fileEntry.name)
  .then(stat => stat.size)
  .then(size => size > fileEntry.maxSize && adapter.flushGeneralLog())
  .catch(console.error)

var setupPolling = (adapter, options) => {
  setInterval(() => {
    options.generalLogFile && rotateLogfile(options.generalLogFile)
    options.errorLogFile && rotateLogfile(options.errorLogFile)
  }, options.pollIntervalMs)
}

LogfileRotator.startInstance = (mariadbCfg, opts) => {
  opts.errorLogFile || opts.generalLogFile || commons.throwError('No files to watch')
  var options = Object.assign({ pollIntervalMs: 15000 }, opts)
  return commons.acquireLockfile(LogfileRotator.lockfile)
    .then(lock => setupPolling(new CmdAdapter(mariadbCfg), options))
}

module.exports = Object.freeze(LogfileRotator)
