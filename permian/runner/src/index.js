var os = require('os')
var execCmd = require('./exec-cmd')
var execFile = require('./exec-file')
var execShellCmd = require('./exec-shell-cmd')
var spawnProcess = require('./spawn-process')

if(os.platform() !== 'linux') {
  commons.throwError('This program runs on Linux')
}

module.exports = {
  execCmd,
  execFile,
  execShellCmd,
  spawnProcess
}
