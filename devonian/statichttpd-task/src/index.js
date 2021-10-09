var imageBuilder = require('@devonian/image-builder')
var contract = require('@devonian/deployment-contract')
var commons = require('@devonian/commons')
var scripts = require('./scripts')

var BASE_IMAGE = contract.BASE_LINUX_IMAGE
var DEFAULT_PORT = 18888

var parseParams = params => Object.assign({
  chownsToUser: [ contract.SERVICE_HOME ],
  podmanOpts: '',
  targetPath: commons.resolvePath('/tmp', params.imageName || commons.throwError('image name must be provided')) + '.img',
  port: DEFAULT_PORT
}, params, { error: false })

var writeScript = (tmpDir, scriptFile, content) => commons.writeFile(commons.resolvePath(tmpDir + contract.SERVICE_HOME, scriptFile), content)

var makeDir = (tmpDir, dir) => commons.mkDir(commons.resolvePath(tmpDir + dir), { recursive: true })

var prepareOptDir = params => commons.createTmpDir()
  .then(tmpDir => params.tmpDir = tmpDir)
  .then(() => makeDir(params.tmpDir, contract.SERVICE_HOME))
  .then(() => makeDir(params.tmpDir, contract.MOUNTED_VOLUME_ROOT))
  .then(() => params.dataDir && commons.cpDirContentsToDir(params.dataDir, commons.resolvePath(params.tmpDir + contract.DATA_ROOT)))
  .then(() => writeScript(params.tmpDir, contract.START_SCRIPT, scripts.createStartScript(params)))
  .then(() => writeScript(params.tmpDir, contract.SETUP_SCRIPT, scripts.createSetupScript(params)))
  .then(() => writeScript(params.tmpDir, contract.HEALTHCHECK_SCRIPT, scripts.createHealthcheckScript(params)))

var createRunScript = params => 'apk add busybox-extras && chmod -cR 755 ' + contract.SERVICE_HOME + (params.runScript ? ' && ' + params.runScript : '')

var createBuildOptions = params => Object.assign(params, {
  baseImage: BASE_IMAGE,
  runScript: createRunScript(params),
  targetPath: commons.resolvePath(params.targetPath),
  optDir: commons.resolvePath(params.tmpDir, 'opt')
})

var getTask = (p, params = parseParams(p)) => (args, callback) => prepareOptDir(params)
  .then(() => imageBuilder.build(createBuildOptions(params)))
  .catch(e => params.error = e || -1)
  .finally(() => commons.rmDir(params.tmpDir).catch(console.error))
  .then(() => params.error ? callback(params.error) : callback())

module.exports = { 
  get: getTask 
}
