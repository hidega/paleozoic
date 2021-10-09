var path = require('path')
var fsPromises = require('fs/promises')
var fs = require('fs')
var {execCmd} = require('@permian/runner')
 
var commons = { 
  isNil: o => o === null || o === undefined,
  isArray: o => Array.isArray(o),
  isFunction: o => !commons.isNil(o) && typeof o === 'function',
  isString: o => !commons.isNil(o) && typeof o === 'string' || o instanceof String,
  isBoolean: o => !commons.isNil(o) && typeof o === 'boolean',
  isNumber: o => !commons.isNil(o) && !commons.isBoolean(o) && !commons.isString(o) && !isNaN(o),
  isObject: o => !commons.isNil(o) && typeof o === 'object',
  execCmd,
  cwd: process.cwd(),
  throwError: e => { throw new Error(e) },
  resolvePath: path.resolve,
  readFileNamesFromDir: dir => fsPromises.readdir(dir, { withFileTypes: true })
    .then(dirents => dirents.filter(d => d.isFile).map(d => path.resolve(dir, d.name))),
  pathSeparator: path.sep,
  copyFile: fsPromises.copyFile,
  deleteFile: file => fsPromises.rm(file, { force: true }),
  pathExistsSync: fs.existsSync,
  direntsToFilenames: dirents => dirents.filter(de => de.isFile()).map(de => de.name),
  readFile: fsPromises.readFile,
  readJson: path => fsPromises.readFile(path).then(data => JSON.parse(data.toString())),
  writeFile: fsPromises.writeFile,
  prettyPrint: o => {
    var result = ''
    if(commons.isBoolean(o) || commons.isNumber(o) || commons.isString(o)) {
      result = o.toString()
    } else if(commons.isObject(o) || commons.isArray(o)) {
      result = JSON.stringify(o, null, 2)
    }
    return result
  },
  mkDir: fsPromises.mkdir,
  rmDir: d => fsPromises.rm(d, { recursive: true, force: true })
}

module.exports = commons
