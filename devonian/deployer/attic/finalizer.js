'use strict'

var commons = require('./commons')

function Finalizer(revert, deploymentPlan) {
  var textIncludesAll = (text, arr) => !arr.find(e => !text.includes(e))

  this.apply = () => commons.spawnProcess(deploymentPlan.commands.podman, ['container', 'ls', '-a'])
    .then(result => {
      var containerNames = deploymentPlan.containers.map(c => c.name)
      return commons.when(textIncludesAll('' + result.output.info + result.output.error, containerNames))
        .then(() => commons.fs.writeJson(commons.resolvePath(commons.systemTmpDir, 'effective_deploymentPlan.json'), deploymentPlan))
        .then(() => Promise.resolve(this))
        .otherwise(() => Promise.reject())
    })

  this.revert = err => revert(err)
}

module.exports = Finalizer
