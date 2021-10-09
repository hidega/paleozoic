var execCmd = require('./exec-cmd')
var fsPromises = require('fs/promises')

var exec = (filename, o, options = o || {}) => {
  options.shell || (options.shell = '/bin/bash')
  return execCmd(`${options.shell} ${filename} ${options.outToFile ? ' > options.outToFile': ''}`) 
}

module.exports = (filename, options) => fsPromises.stat(filename)
  .then(stat => stat.isFile() ? exec(filename, options) : Promise.reject('Not a file: ' + filename))
