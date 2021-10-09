'use strict'

var download = require('download')
var commons = require('./commons')
var Step = require('./step')

function ImageProvider(previousStep) {
  Step.call(this, previousStep)

  this.deploymentPlan = commons.cloneDeep(Object.assign({ images: [] }, previousStep.deploymentPlan))

  var resolvePath = i => i.startsWith('.') || i.startsWith('/') ? i : commons.resolvePath(this.deploymentPlan.dir, i)

  var loadCmd = () => this.deploymentPlan.images.reduce((acc, i) => `${acc} ${this.deploymentPlan.commands.podman} load ${resolvePath(i)} &&`, '')

  this.apply = () => commons.spawnProcess(this.deploymentPlan.commands.bash, ['-c', `${loadCmd() + ' echo'}`]).then(() => this)
}

//download('unicorn.com/foo.jpg').pipe(fs.createWriteStream('dist/foo.jpg'))

module.exports = previousStep => new ImageProvider(previousStep)
