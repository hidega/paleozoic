'use strict'

var commons = require('./commons')

module.exports = parameters => commons.fs.readJson(parameters.deploymentPlanFile)
  .then(deploymentPlan => {
    deploymentPlan.secret = parameters.secret
    deploymentPlan.srcfile = parameters.deploymentPlanFile
    deploymentPlan.dir = commons.dirname(commons.resolvePath(parameters.deploymentPlanFile))
    deploymentPlan.podmanOpts && (deploymentPlan.commands.podman += ' ' + deploymentPlan.podmanOpts)
    deploymentPlan.configDir = deploymentPlan.configDir || '/etc/devonian-containers'
    deploymentPlan.hasOwnProperty('id') || (deploymentPlan.id = commons.uuid())
    return deploymentPlan
  })
