var parameters = require('./project-parameters')
var commons = require('./commons')

module.exports = () => parameters.get()
  .then(parameters => commons.rmDir(parameters.objPath)
    .then(() => commons.rmDir(parameters.distPath))
    .then(() => commons.mkDir(parameters.objPath))
    .then(() => commons.mkDir(parameters.distPath)))
