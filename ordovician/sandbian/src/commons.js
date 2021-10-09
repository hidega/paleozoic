var path = require('path')
var fsPromises = require('fs/promises')

var cwd = process.cwd()

var commons = {
  cwd,
  throwError: e => { throw new Error(e) },
  resolvePath: path.resolve,
  readFilesFromDir: dir => fsPromises.readdir(dir, { withFileTypes: true })
    .then(dirents => dirents.filter(d => d.isFile).map(d => path.resolve(dir, d.name))),
  pathSeparator: path.sep,
  copyFile: fsPromises.copyFile,
  mkDir: fsPromises.mkdir,
  rmDir: d => fsPromises.rm(d, { recursive: true, force: true })
}

module.exports = commons

