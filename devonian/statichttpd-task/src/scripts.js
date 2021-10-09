var contract = require('@devonian/deployment-contract')
var ShSupport = require('@devonian/sh-support')

var shSupport = ShSupport.newInstance({
  errorFile: contract.ERROR_FILE
})

var baseScript = `
  ${shSupport.shebang()}
  ${shSupport.clearErrorsCmd}
  ${shSupport.checkEnvsCmdBlock([contract.ENV_MIDDLEWARE_USER, contract.ENV_MIDDLEWARE_USER_ID])}
  DATA_ROOT=${contract.DATA_ROOT}
  ${shSupport.checkDirExistsCmd('DATA_ROOT')}
`

var createHealthcheckScript = params => shSupport.normalizeScript(`
  ${baseScript}
  PING_RESULT=$(sleep 2 | telnet $(hostname -i) ${params.port} | grep -e 'Connected' | wc -l)
  [ "$PING_RESULT" -eq "0" ] && exit 1
  ${shSupport.exitOkCmd}
`) 

var createSetupScript = params => shSupport.normalizeScript(`
  ${shSupport.shebang()}
  ${shSupport.checkAndSetUserCmdBlock(contract.ENV_MIDDLEWARE_USER, contract.ENV_MIDDLEWARE_USER_ID)}
  ${shSupport.chownCmdBlock(contract.ENV_MIDDLEWARE_USER, params.chownsToUser.map(shSupport.singleQuote), true)}
`)

var startHttpdCmd = params => `httpd -p $(hostname -i):${params.port} -h ${contract.DATA_ROOT} ${shSupport.redirectToNullExpr} `

var touchRestartedCmd = ` echo $(date -uIseconds) > ${contract.SERVICE_HOME}/restarted `

var createStartScript = params => shSupport.normalizeScript(`
  ${baseScript}
  ${shSupport.invokeSetupOnceBlock(contract.SERVICE_HOME + '/' + contract.SETUP_SCRIPT)}
  ${shSupport.su(contract.ENV_MIDDLEWARE_USER, startHttpdCmd(params))}
  ${shSupport.exitErrorIfLastFailedCmd('Cannot start service')}
  ${shSupport.su(contract.ENV_MIDDLEWARE_USER, touchRestartedCmd)}
  tail -f /dev/null
  exit 1
`)

module.exports = {
  createStartScript,
  createSetupScript,
  createHealthcheckScript
}
