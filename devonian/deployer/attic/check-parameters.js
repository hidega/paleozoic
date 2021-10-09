'use strict'

var commons = require('./commons')

module.exports = () => {
  var deploymentPlanFile = process.argv[3] || './deployment-plan.json'
  var secret = process.argv[2]
  secret || commons.throwError('Secret is not provided')
  return { deploymentPlanFile, secret }
}
