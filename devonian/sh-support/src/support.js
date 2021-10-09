var ShSupportBase = require('./support-base')
var ShSupportPodman = require('./support-podman')

var parseParams = p => Object.assign({}, p)

function ShSupport(p, params = parseParams(p)) {
  ShSupportBase.call(this, params)
  ShSupportPodman.call(this)

  var chownPathsReduce = (userNameVar, pathVarNames, recursive) => pathVarNames.reduce((acc, pathVarName) => {
    var recFlag = recursive ? 'R' : ''
    acc += `chown -c${recFlag} $${userNameVar} $${pathVarName} ${this.redirectToNullExpr}\n`
    return acc + `${this.exitErrorIfLastFailedCmd('chown problem: $' + pathVarName + ' - $' + userNameVar)}\n`
  }, '\n')

  var chownPaths = (userNameVar, pathVarNames, recursive) => pathVarNames ? chownPathsReduce(userNameVar, pathVarNames, recursive) + '\n/bin/true\n' : ''

  var checkEnvs = envs => envs ? envs.reduce((acc, env) => acc + `[ -z "$${env}" ] && ${this.exitErrorCmd('Unset env var ' + env)}\n`, '\n') : ''

  var checkDirExists = dirVarName => `[ ! -d "$${dirVarName}" ] && ${this.exitErrorCmd('Dir does not exist: $' + dirVarName)}`

  this.strToExpr = str => `(echo "${'' + str}")`

  this.checkAndSetUserCmdBlock = (userNameVar, userIdVar) => this.wrapCmdBlock(`
    ACTUAL_USER_ID=$(id -u $${userNameVar})
    if [ -z "$ACTUAL_USER_ID" ]
    then
      adduser -D -u $${userIdVar} -s /bin/sh $${userNameVar}
      ${this.exitErrorIfLastFailedCmd('Cannot create user $' + userNameVar)}
      ACTUAL_USER_ID=$(id -u $${userNameVar})
    fi
    [ "$ACTUAL_USER_ID" != "$${userIdVar}" ] && ${this.exitErrorCmd('User $' + userNameVar + ' ID mismatch: $ACTUAL_USER_ID / $' + userIdVar)}`)

  this.checkEnvsCmdBlock = envs => this.wrapCmdBlock(checkEnvs(envs))

  this.checkDirExistsCmd = dirVarName => this.wrapCmdBlock(checkDirExists('' + dirVarName))

  this.invokeSetupOnceBlock = setupPath => this.wrapCmdBlock(`
    . ${setupPath}
    ${this.exitErrorIfLastFailedCmd('setup script error: ' + setupPath)}
    echo '/bin/true' > ${setupPath}`)

  this.checkJq = `jq --version
    ${this.exitErrorIfLastFailedCmd('jq was not found')}`

  this.checkCurl = `curl --version ${this.redirectToNullExpr}
    ${this.exitErrorIfLastFailedCmd('curl was not found')}`

  this.checkWget = `wget --version 
    ${this.exitErrorIfLastFailedCmd('wget was not found')}`

  this.chownCmdBlock = (userNameVar, pathVarNames, recursive) => this.wrapCmdBlock(chownPaths(userNameVar, pathVarNames, recursive))
}

ShSupport.newInstance = p => Object.freeze(new ShSupport(p))

module.exports = ShSupport
