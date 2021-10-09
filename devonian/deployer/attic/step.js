'use strict'

function Step(previousStep) {
  this.deploymentPlan = previousStep.deploymentPlan
  this.previousStep = previousStep
  this.revert = previousStep.revert
}

module.exports = Step
