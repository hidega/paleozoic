'use strict'

var commons = require('@permian/commons')

module.exports = {
  spawnProcess: commons.proc.spawnProcess,
  isoDateNow: commons.date.isoDateNow,
  matcher: commons.lang.matcher,
  throwError: commons.lang.throwError,
  isLinux: commons.platform.isLinux,
  assert: (v, n) => v || commons.throwError('Bad or missing configuration parameter(s) ' + (n || 1001)),
  acquireLockfile: commons.files.acquireLockfile,
  fs: commons.files.fsExtra,
  cloneDeep: commons.lang.cloneDeep,
  chainFunctions: commons.lang.chainFunctions,
  resolvePath: commons.files.resolvePath
}
