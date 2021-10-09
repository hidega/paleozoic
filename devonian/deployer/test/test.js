'use strict'

var path = require('path')
var assert = require('assert')
var commons = require('../src/commons')
var StorageLimitSetter = require('../src/storagelimit-setter')
var ContainerDeployer = require('../src/container-deployer')
var ContainerManager = require('../src/container-manager')
var NetworkCreator = require('../src/network-creator')
var StarterscriptCreator = require('../src/starterscript-creator') 
var Finalizer = require('../src/finalizer')
var checkSystem = require('../src/check-system')

var deploymentPlan = commons.fs.readJsonSync(path.resolve(__dirname, 'deployment-plan.json'))
deploymentPlan.starterScript.dir = __dirname

var caseCheckSystem = () => checkSystem().then(o => o instanceof Object ? console.log('checkSystem done') : Promise.reject('bad object'))

var caseStoragelimit = () => { 
  var cfgFile = path.resolve(__dirname, 'storage.conf')
  deploymentPlan.storageLimit.cfgFile = cfgFile
  deploymentPlan.configDir = __dirname

  var cfg = `
# storage.conf is the configuration file for all tools
# that share the containers/storage libraries
# See man 5 containers-storage.conf for more information

# The "container storage" table contains all of the server options.
[storage]

# Default Storage Driver
driver = "overlay"

# Temporary storage location
runroot = "/var/run/containers/storage"

# Primary read-write location of container storage
graphroot = "/var/lib/containers/storage"

[storage.options]
# AdditionalImageStores is used to pass paths to additional read-only image stores
# Must be comma separated list.
additionalimagestores = [
]

# Size is used to set a maximum size of the container image.  Only supported by
# certain container storage drivers (currently overlay, zfs, vfs, btrfs)
size = ""

# OverrideKernelCheck tells the driver to ignore kernel checks based on kernel version
override_kernel_check = "true"
`

  return commons.fs.remove(cfgFile)
    .then(() => commons.fs.writeFile(cfgFile, cfg))
    .then(() => new StorageLimitSetter(assert.fail, deploymentPlan).apply())
    .then(o => o instanceof StorageLimitSetter ? console.log('storageLimitSetter done') : Promise.reject('bad object'))
}

var caseStartscript = () => {
  deploymentPlan.starterScript = {
    dir: __dirname,
    scriptFile: 'devonian-starter.sh'
  }
  return new StarterscriptCreator(assert.fail, deploymentPlan).apply()
    .then(o => o instanceof StarterscriptCreator ? console.log('starterscriptCreator done') : Promise.reject('bad object'))
}

var caseNetwork = () => {
  var networkCreator = new NetworkCreator(assert.fail, deploymentPlan)
  return networkCreator.apply()
    .then(o => o instanceof NetworkCreator ? console.log('networkCreator done') : Promise.reject('bad object'))
}

var caseContainerDeployer = () => {
  var containerDeployer = new ContainerDeployer(assert.fail, deploymentPlan)
  return containerDeployer.apply()
    .then(o => o instanceof ContainerDeployer ? console.log('containerDeployer done') : Promise.reject('bad object'))
}

var caseContainerManager = () => {
  deploymentPlan.manager = {
    crontabFile: path.resolve(__dirname, 'crontab')
  }
  var containerManager = new ContainerManager(assert.fail, deploymentPlan)
  return containerManager.apply()
    .then(o => o instanceof ContainerManager ? console.log('containerManager done') : Promise.reject('bad object'))
}

var caseFinalizer = () => {
  deploymentPlan.commands = Object.assign(deploymentPlan.commands , { 
    updateRcD: './updatercd.sh', 
    chkconfig: './chkconfig.sh'
  })
  var finalizer = new Finalizer(assert.fail, deploymentPlan)
  return finalizer.apply().then(() => console.log('finalizer done'))
}

caseCheckSystem()
  .then(() => caseStoragelimit())
  .then(() => caseStartscript())
  .then(() => caseNetwork())
  .then(() => caseContainerDeployer())
  .then(() => caseContainerManager())
  .then(() => caseFinalizer())
  .then(() => console.log('OK'))
  .catch(e => console.error('ERROR:\n', e))
