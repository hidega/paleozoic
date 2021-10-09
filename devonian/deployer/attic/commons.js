'use strict'

var commons = require('@permian/commons')

var timeoutMs = 120000
var isUbuntu = commons.platform.isUbuntu()
var isRedhat = commons.platform.isRedhat()

module.exports = {
  spawnProcess: (cmd, args, ignoreRetval) => {
    var toHandle = setTimeout(() => commons.lang.throwError(cmd + ' timeout'), timeoutMs)
    return commons.proc.spawnProcess(cmd, args).then(result => {
      clearTimeout(toHandle)
      return (result.code === 0) || ignoreRetval ? result : Promise.reject(cmd + ':' + result.code)
    })
  },
  isUbuntu: () => isUbuntu,
  isRedhat: () => isRedhat,
  dirname: commons.files.dirname,
  sleep: commons.lang.sleep,
  resolvePath: commons.files.resolvePath,
  matcher: commons.lang.matcher,
  when: commons.lang.when,
  uuid: commons.lang.uuid,
  systemTmpDir: commons.files.systemTmpDir,
  throwError: commons.lang.throwError,
  fs: commons.files.fsExtra,
  linuxOrThrow: commons.platform.linuxOrThrow,
  terminateProcess: commons.proc.terminateProcess,
  assignRecursive: commons.lang.assignRecursive,
  cloneDeep: commons.lang.cloneDeep
}
