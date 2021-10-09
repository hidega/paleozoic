'use strict'

var commons = require('./commons')

function ContainerDeployer(revert, deploymentPlan) {
  var delayMs = 2000

  var podman = deploymentPlan.commands.podman

  var removeAllContainers = () => commons.spawnProcess(podman, ['container', 'stop', '-a'], true)
    .then(() => commons.spawnProcess(podman, ['container', 'rm', '-af'], true))

  var createRunCmd = (acc, container) => {
    var args = commons.matcher().all()
      .on(container.publish, p => ` --publish=${p.onHost}:${p.onContainer}`)
      .on(container.env, e => ` --env ${e.name}=${e.value}`)
      .on(container.cpus, c => ` --cpus=${c}`)
      .on(container.stopTimeoutSecs, t => ` --stop-timeout=${t}`)
      .on(container.hostname, h => ` --hostname=${h}`)
      .on(container.ip, i => ` --ip=${i}`)
      .on(container.network, n => ` --network=${n}`)
      .on(container.healthRetries, r => ` --health-retries=${r}`)
      .on(container.healthStartPeriod, p => ` --health-start-period=${p}`)
      .on(container.healthTimeout, t => ` --health-timeout=${t}`)
      .on(container.memory, m => ` --memory=${m}`)
      .on(container.hosts, hosts => hosts.reduce((acc, host) => acc + ` --add-host=${host.name}:${host.ip} `, ''))
      .end()
    var cmd = podman + ` run --detach=true --privileged=true --restart=no --name=${container.name} `
    return acc + cmd + args.join(' ') + ' ' + container.image + ' && '
  }

  this.deploymentPlan = deploymentPlan

  this.apply = () => removeAllContainers()
    .then(() => commons.sleep(delayMs))
    .then(() => {
      var runCmd = deploymentPlan.containers.reduce(createRunCmd, '')
      return commons.spawnProcess(deploymentPlan.commands.bash, ['-c', `${runCmd + ' echo'}`])
        .then(() => commons.sleep(delayMs))
        .then(() => this)
    })

  this.revert = err => removeAllContainers().then(() => revert(err))
}

module.exports = ContainerDeployer
