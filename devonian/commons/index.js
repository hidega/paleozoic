var fs = require('fs-extra')
var fsPromises = require('fs/promises')
var commons = require('@permian/commons')

var dumpRet = ret => {
  console.log('\nstdout:\n', ret?.stdout)
  console.log('\nstderr:\n', ret?.stderr)
}

var executeScriptAsFileInTempdir = (script, c, tmpDir, tmpFile) => c.createTmpDir()
  .then(td => (tmpDir = td) && (tmpFile = c.resolvePath(tmpDir, 'script.sh')) && c.rmDir(c.resolvePath(tmpDir)))
  .then(() => c.mkDir(c.resolvePath(tmpDir), c.RF))
  .then(() => c.writeFile(tmpFile, script))
  .then(() => c.execCmd('bash', [tmpFile]))
  .then(dumpRet)
  .catch(ret => {
     dumpRet(ret)
     return Promise.reject(ret)
  })
  .finally(() => c.rmDir(tmpDir).catch(console.error))

var commons = {
  tmpDir: commons.files.tmpDir,
  execCmd: commons.proc.execCmd,
  cwd: commons.proc.cwd,
  fsExtra: fs,
  fsPromises,
  rmDir: commons.files.rmDir,
  throwError: commons.lang.throwError,
  readFile: commons.files.readFile,
  resolvePath: commons.files.resolvePath,
  copyFileToFile: commons.files.copyFile,
  pathSeparator: commons.files.pathSeparator,
  writeFile: commons.files.writeFile,
  checkPathExists: commons.files.checkPathExists,
  mkDir: commons.files.mkDir,
  tmpPath: commons.files.tmpPath,
  when: commons.lang.when,
  RF: { recursive: true, force: true },
  createTmpDir: commons.files.createTmpDir,
  imageNameToFileName: fn => fn.replace('/', '_').replace(':', '__'),
  cpDirContentsToDir: (srcDir, targetDir) => fs.copy(srcDir, targetDir)
}

commons.executeScriptAsFileInTempdir = s => executeScriptAsFileInTempdir(s, commons)

module.exports = Object.freeze(commons)
