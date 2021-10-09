var contract = require('@devonian/deployment-contract')
var ShSupport = require('@devonian/sh-support')

var shSupport = ShSupport.newInstance({
  errorFile: contract.ERROR_FILE
})

var baseScript = `
  ${shSupport.shebang()}
  ${shSupport.clearErrorsCmd()}
  ${shSupport.checkEnvsCmdBlock([contract.ENV_MIDDLEWARE_USER, contract.ENV_MIDDLEWARE_USER_ID])}
`

var startServiceCmd = `${contract.NODEJS_DIR}/bin/node ${contract.SERVICE_HOME}/${contract.MAIN_JS} ${contract.START_CMD}`

var createStartScript = params => shSupport.normalizeScript(`
  ${baseScript}
  ${params.devonianService.setupScriptPath ? shSupport.invokeSetupOnceBlock(contract.SERVICE_HOME + '/' + contract.SETUP_SCRIPT) : ''}
  ${shSupport.su(contract.ENV_MIDDLEWARE_USER, startServiceCmd)}
  ${shSupport.exitErrorIfLastFailedCmd('Start failed')}
`)

var createHealthcheckScript = params => shSupport.normalizeScript(`
  ${baseScript}
  ${contract.NODEJS_DIR}/bin/node ${contract.SERVICE_HOME}/${contract.MAIN_JS} ${contract.HEALTHCHECK_CMD}
  ${shSupport.exitErrorIfLastFailedCmd('Healthcheck failed')}
`)

module.exports = {
  createStartScript,
  createHealthcheckScript
}
