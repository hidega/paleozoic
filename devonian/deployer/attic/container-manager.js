'use strict'

var commons = require('./commons')
var createHealthCheckScript = require('./healthcheck-script')

function ContainerManager(revert, deploymentPlan) {
  var defaultDeploymentPlan = {
    manager: {
      unhealthyActionFile: 'action_if_unhealthy',
      healthcheckPeriodMins: "*/02",
      crontabFile: '/etc/crontab'
    }
  }

  this.deploymentPlan = commons.assignRecursive(defaultDeploymentPlan, deploymentPlan)
  var healthCheckScriptFile = commons.resolvePath(this.deploymentPlan.configDir, 'healthcheck.sh')
  var unhealthyActionFile = commons.resolvePath(this.deploymentPlan.configDir, this.deploymentPlan.manager.unhealthyActionFile)
  var healthCheckScript = createHealthCheckScript({
    unhealthyActionFile,
    containers: this.deploymentPlan.containers
  })

  var originalCrontab

  this.apply = () => commons.fs.ensureDir(this.deploymentPlan.configDir)
    .then(() => commons.fs.pathExists(unhealthyActionFile))
    .then(exists => exists ? Promise.resolve() : commons.fs.writeFile(unhealthyActionFile, 'RESTART'))
    .then(data => commons.fs.writeFile(healthCheckScriptFile, healthCheckScript))
    .then(() => commons.spawnProcess(this.deploymentPlan.commands.chmod, ['-c', '755', healthCheckScriptFile]))
    .then(() => commons.fs.readFile(this.deploymentPlan.manager.crontabFile))
    .then(data => {
      originalCrontab = data
      var arr = data.toString().split('\n').filter(l => !l.trim().startsWith('#') && !l.includes(healthCheckScriptFile))
      arr.push(`${this.deploymentPlan.manager.healthcheckPeriodMins.toString()} * * * * root ${healthCheckScriptFile} > /dev/null 2>&1\n`)
      return arr.join('\n').replace(/\n{2,}/g, '\n')
    })
    .then(data => commons.fs.writeFile(this.deploymentPlan.manager.crontabFile, data))
    .then(() => this)

  this.revert = err => commons.fs.writeFile(this.deploymentPlan.manager.crontabFile, originalCrontab).then(() => revert(err))
}

module.exports = ContainerManager
