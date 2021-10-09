var commons = require('@devonian/commons')
var { when } = commons

module.exports = opts => {
  var options = Object.assign({}, opts)
  options.donotSave = !!options.donotSave
  options.keepTmpData = !!options.keepTmpData
  options.podmanOpts ??= ''
  options.imageName || commons.throwError('missing image name')
  options.baseImage || commons.throwError('missing base image name')
  options.optDir || commons.throwError('missing /opt source dir')
  options.optDir = commons.resolvePath(options.optDir)
  when(options.targetPath)
    .then(() => commons.resolvePath(options.targetPath))
    .otherwise(() => commons.resolvePath(commons.tmpDir, 'devonian-image01'))
  return options
}
