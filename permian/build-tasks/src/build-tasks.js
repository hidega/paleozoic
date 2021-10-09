var os = require('os')
var merge = require('lodash.merge')
var GlobalConfig = require('./global-cfg.json')
var jshint = require('./jshint')
var clean = require('./clean')
var docs = require('./docs')
var format = require('./format')
var commons = require('./commons')
var webpack = require('./webpack')
var pkgsum = require('./pkgsum')
var updateDeps = require('./update-deps')
var packUpload = require('./pack-upload')

function BuildTasks(c) {
  os.platform() === 'linux' || commons.throwError('This program runs on Linux')
  var cfg = merge({ workingDir: commons.cwd }, c)
  cfg.workingDir = commons.resolvePath(cfg.workingDir)

  var resolveInCwd = p => commons.resolvePath(cfg.workingDir, p)

  var resolvePackageJson = params => (params.packageJson && commons.resolvePath(params.packageJson)) || 
    (cfg.packageJson && commons.resolvePath(cfg.packageJson)) || 
    resolveInCwd('package.json')

  this.getConfiguration = () => merge({}, cfg)

  this.tasks = (params, callback) => {
    Object.keys(this).filter(e => e !== 'getConfiguration').sort().forEach(k => commons.isFunction(this[k]) && console.log(' ' + k))
    console.log('\nGlobal config:\n', commons.prettyPrint(merge(GlobalConfig, cfg)))
    callback()
  }

  this.updateDeps = (params, callback) => updateDeps({
    packageJson: resolvePackageJson(params),
    upload: GlobalConfig.upload,
    localPkgPrefixes: GlobalConfig.localPkgPrefixes
  }, callback)

  this.clean = (params, callback) => clean({ workingDir: cfg.workingDir }, callback) 

  this.packUpload = (params, callback) => packUpload({ 
    packageJson: resolvePackageJson(params),
    upload: GlobalConfig.upload,
    localPkgPrefixes: GlobalConfig.localPkgPrefixes,
    workingDir: cfg.workingDir 
  }, callback)

  this.webpack = (params, callback) => webpack({ 
    cwd: cfg.workingDir,
    webpackConfig: params?.webpackConfig,
    distDir: resolveInCwd(GlobalConfig.webpack.distDir),
    entryFile: resolveInCwd(GlobalConfig.webpack.entryFile),
    distFile: GlobalConfig.webpack.distFile
  }, callback)

  this.docs = (params, callback) => docs({
    packageJson: resolvePackageJson(params),
    cwd: cfg.workingDir,
    docFile: resolveInCwd(GlobalConfig.doc.output),
    docSrc: resolveInCwd(GlobalConfig.doc.srcFile)
  }, callback) 

  this.jshint = (params, callback) => jshint({
    args: params.args,
    srcDir: resolveInCwd(GlobalConfig.srcDirs.js),
    reportFile: params.reportFile || resolveInCwd(GlobalConfig.jshint.reportFile),
    options: cfg.jshintOptions || {}
  }, callback) 

  this.format = (params, callback) => format({
    srcDir: resolveInCwd(GlobalConfig.srcDirs.js),
    options: cfg.formatOptions || {}
  }, callback) 

  this.pkgsum = (params, callback) => pkgsum({
    hashFile: resolveInCwd(GlobalConfig.hashFile),
    subjectDir: resolveInCwd(GlobalConfig.srcDirs.js),
    packageJson: resolvePackageJson(params)
  }, callback)
}

module.exports = Object.freeze(BuildTasks)
