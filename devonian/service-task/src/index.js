var validate = require('./validate-params')
var scripts = require('./scripts')
var contract = require('@devonian/deployment-contract')
var imageBuilder = require('@devonian/image-builder')
var commons = require('@devonian/commons')
var { resolvePath } = commons

var BASE_IMAGE = contract.NODEBASE_IMAGE

var writeScript = (tmpDir, scriptFile, content) => commons.writeFile(resolvePath(tmpDir + contract.SERVICE_HOME, scriptFile), content)

var createBuildOptions = params => Object.assign(params, {
  baseImage: BASE_IMAGE,
  runScript: 'chmod -cR 755 ' + contract.SERVICE_HOME + (params.runScript ? ' && ' + params.runScript : ''),
  targetPath: resolvePath(params.targetPath),
  optDir: resolvePath(params.tmpDir, 'opt')
})

var writeSetupFile = params => params.devonianService.setupScriptPath && commons.readFile(resolvePath(params.tmpDir, params.devonianService.setupScriptPath))
  .then(buf => writeScript(params.tmpDir, contract.SETUP_SCRIPT, buf.toString()))

var createDevonianServiceFiles = params => writeScript(params.tmpDir, contract.START_SCRIPT, scripts.createStartScript(params))
  .then(() => writeSetupFile(params))
  .then(() => writeScript(params.tmpDir, contract.HEALTHCHECK_SCRIPT, scripts.createHealthcheckScript(params)))
  .then(() => commons.copyFileToFile(resolvePath(params.devonianService.mainJsPath), resolvePath(params.tmpDir + contract.SERVICE_HOME, contract.MAIN_JS)))

var createOrdinaryService = params => commons.cpDirContentsToDir(params.serviceDir, resolvePath(params.tmpDir + contract.SERVICE_HOME))

var prepareOptDir = params => commons.createTmpDir()
  .then(tmpDir => { 
    params.tmpDir = tmpDir
    return commons.mkdir(resolvePath(params.tmpDir + contract.SERVICE_HOME), { recursive: true, force: true })
  })
  .then(() => params.devonianService ? createDevonianServiceFiles(params) : createOrdinaryService(params))

var getTaskImpl = (p, params) => (args, callback) => validate(p)
  .then(pa => prepareOptDir(params = pa))
  .then(() => imageBuilder.build(createBuildOptions(params)))
  .catch(e => params.error = e || -1)
  .finally(() => commons.rmDir(params.tmpDir).catch(console.error))
  .then(() => callback(params.error))

var getTask = p => getTaskImpl(p)

module.exports = {
  get: getTask
}
