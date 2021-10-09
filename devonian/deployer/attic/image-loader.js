'use strict'

var commons = require('./commons')

function ImageLoader(revert, deploymentPlan) {
  this.deploymentPlan = Object.assign({ images: [] }, deploymentPlan)

  var resolvePath = i => i.startsWith('.') || i.startsWith('/') ? i : commons.resolvePath(deploymentPlan.dir, i)

  var loadCmd = () => deploymentPlan.images.reduce((acc, i) => `${acc} ${deploymentPlan.commands.podman} load ${resolvePath(i)} &&`, '')

  this.apply = () => commons.spawnProcess(deploymentPlan.commands.bash, ['-c', `${loadCmd() + ' echo'}`]).then(() => this)

  this.revert = revert
}

module.exports = ImageLoader
