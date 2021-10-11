var path = require('path')
var fs = require('fs')
var fsPromises = require('fs/promises')
var os = require('os')
var pkgRoot = require('app-root-path')

var throwError = msg => {
  throw new Error(msg)
}

var tmpPath = () => path.resolve(os.tmpdir(), 'tmpdir_' + parseInt(Math.random() * 1000000) + '_' + Date.now())

var rmDir = dir => fsPromises.rm(dir, { recursive: true, force: true })

var mkDir = dir => fsPromises.mkdir(dir, { recursive: true, force: true })

var acquireLockfile = (lockfile, callback) => fsPromises.remove(lockfile)
  .then(() => fsPromises.open(lockfile, 'wx'))
  .then(fd => fsPromises.write(fd, process.pid.toString()).then(() => fd))
  .then(fd => callback ? callback(false, cb => fsPromises.close(fd, cb), fd) : { fd, release: () => fsPromises.close(fd) })
  .catch(e => callback ? callback(e) : throwError(e))

var dumpPidToFile = filename => {
  var result = false
  try {
    var appdir = path.dirname(require.main.filename)
    filename ??= path.resolve(appdir, 'pidfile')
    fs.writeFileSync(filename, process.pid)
  } catch (e) {
    result = e
  }
  return result
}

var createTmpDir = (tmpDir = tmpPath()) => rmDir(tmpDir)
  .catch(() => { })
  .then(() => mkDir(tmpDir))
  .then(() => tmpDir)

module.exports = {
  acquireLockfile,
  pathFromArray: array => array.reduce((result, pe) => result + path.sep + pe.replace('/', ''), ''),
  dumpPidToFile,
  packageRoot: pkgRoot.toString(),
  resolvePath: path.resolve,
  currentDir: () => path.dirname(require.main.filename),
  dirname: path.dirname,
  readFile: (path, encoding) => fsPromises.readFile(path, encoding ? { encoding } : {}),
  copyFileToFile: (src, dest) => fsPromises.copyFile(src, dest),
  mkDir,
  deleteFile: fsPromises.unlink,
  writeFile: (file, data, encoding) => fsPromises.writeFile(file, data, encoding ? { encoding } : {}),
  checkPathExists: path => fsPromises.stat(path),
  readJson: path => fsPromises.readFile(path).then(data => JSON.parse(data.toString())),
  pathSeparator: path.sep,
  systemTmpDir: os.tmpdir,
  tmpDir: os.tmpdir(),
  tmpPath,
  createTmpDir,
  rmDir
}
