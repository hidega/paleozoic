'use strict'

var Tools = require('./tools')
var CommandAdapter = require('./cmd/adapter')
var createConfig = require('./cfg/creator')
var commons = require('./commons')

commons.isLinux() || commons.throwError('Unsupported platform')

module.exports = Object.freeze({
  Tools,
  CommandAdapter,
  createConfig
})
