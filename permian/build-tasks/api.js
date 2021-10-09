var merge = require('lodash.merge')
var GlobalConfig = require('./src/global-cfg.json')
var jshint = require('./src/jshint')
var clean = require('./src/clean')
var docs = require('./src/docs')
var format = require('./src/format')
var commons = require('./src/commons')
var pkgsum = require('./src/pkgsum')
var updateDeps = require('./src/update-deps')
var packUpload = require('./src/pack-upload')
var BuildTasks = require('./src/build-tasks')

module.exports = {
  merge,
  BuildTasks,
  GlobalConfig,
  jshint,
  clean,
  docs,
  format,
  commons,
  pkgsum,
  updateDeps,
  packUpload
}

