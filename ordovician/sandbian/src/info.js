var packageJson = require('../package.json')
var parameters = require('./project-parameters')

var createInfo = () => parameters.get().then(p => ({
  msg: {
    sandbianVersion: packageJson.version,
    effectiveParameters: p
  }
}))

module.exports = createInfo

