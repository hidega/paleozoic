var commons = require('@permian/commons')

module.exports = {
  spawnProcess: commons.proc.spawnProcess,
  throwError: commons.lang.throwError,
  isLinux: commons.platform.isLinux,
  assert: (v, n) => v || commons.throwError('Bad or missing configuration parameter(s) ' + (n || 1001)),
  acquireLockfile: commons.files.acquireLockfile,
  fs: commons.files.fsExtra,
  cloneDeep: commons.lang.cloneDeep,
  chainFunctions: commons.lang.chainFunctions,
  resolvePath: commons.files.resolvePath
}
