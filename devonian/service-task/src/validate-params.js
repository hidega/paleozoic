var commons = require('@devonian/commons')
var contract = require('@devonian/deployment-contract')

var checkServiceDir = params => commons.checkPathExists(commons.resolvePath(params.serviceDir, contract.HEALTHCHECK_SCRIPT))
  .then(() => commons.checkPathExists(commons.resolvePath(params.serviceDir, contract.START_SCRIPT)))
  .then(() => params)

var checkDevonianService = params => commons.checkPathExists(commons.resolvePath(params.devonianService.mainJsPath))
  .then(() => params.devonianService.setupScriptPath ? commons.checkPathExists(commons.resolvePath(params.devonianService.setupScriptPath)) : true)
  .then(() => params)

var checkServiceParams = params => (params.serviceDir && params.devonianService && commons.throwError('Do not provide both serviceDir and devonianService parameters')) &&
  (!params.serviceDir && !params.devonianService) && commons.throwError('serviceDir or devonianService parameter is not provided')

var validateParameters = p => {
  var params = Object.assign({ runScript: '' }, p)
  params.imageName || commons.throwError('imageName parameter is not provided')
  checkServiceParams(params)
  return params.serviceDir ? checkServiceDir(params) : checkDevonianService(params)
}

module.exports = validateParameters
