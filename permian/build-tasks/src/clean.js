var commons = require('./commons')

module.exports = (params, callback) => commons.deleteFile(commons.resolvePath(params.workingDir, 'package-lock.json'))
  .then(() => commons.rmDir(commons.resolvePath(params.workingDir, 'node_modules')))
  .then(() => commons.execCmd('npm', ['cache', 'clear', '--force']))
  .then(() => callback())
  .catch(e => callback(e || -1))
