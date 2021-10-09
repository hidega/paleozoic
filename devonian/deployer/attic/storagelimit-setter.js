'use strict'

var commons = require('./commons')

function StorageLimitSetter(previousStep) {
  var originalCfg

  var defaultDeploymentPlan = {
    storageLimit: {
      cfgFile: '/etc/containers/storage.conf'
    }
  }

  this.deploymentPlan = commons.assignRecursive(defaultDeploymentPlan, previousStep.deploymentPlan)

  this.apply = () => commons.when(this.deploymentPlan.storageLimit.limit)
    .then(commons.fs.readFile(this.deploymentPlan.storageLimit.cfgFile)
      .then(buf => {
        originalCfg = buf.toString()
        var cfg = buf.toString().split('\n').reduce((acc, l) => l.trim().startsWith('size') ? acc : acc + l + '\n', '')
        cfg += 'size="' + this.deploymentPlan.storageLimit.limit + '"'
        return commons.fs.writeFile(this.deploymentPlan.storageLimit.cfgFile, cfg)
      })
      .then(() => this))
    .otherwise(this)

  this.revert = err => commons.when(this.deploymentPlan.storageLimit.limit)
    .then(() => commons.fs.writeFile(this.deploymentPlan.storageLimit.cfgFile, originalCfg).then(() => previousStep.revert(err)))
    .otherwise(() => previousStep.revert(err))
}

module.exports = previousStep => new StorageLimitSetter(previousStep)
