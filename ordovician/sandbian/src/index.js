var commons = require('./commons')
var info = require('./info')
var clean = require('./clean')
var buildAndroid = require('./build-android')
var buildJava = require('./build-java')
var test = require('./test')
var help = require('./help')
var precheck = require('./precheck.js')
var {PARAMETERS_FILE} = require('./project-parameters')

var tasks = {
  clean: () => precheck().then(clean),
  info: () => precheck().then(info),
  help,
  test,
  PARAMETERS_FILE
}

tasks.buildJava = () => tasks.clean().then(buildJava)

tasks.build = () => tasks.buildJava().then(buildAndroid)

module.exports = tasks

