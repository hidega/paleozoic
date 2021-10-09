var ShSupport = require('..')
var fs = require('fs')

var shSupport = ShSupport.newInstance({ errorFile: __dirname + '/errors.txt'})

var script = `
  ${shSupport.shebang()}

  ${shSupport.checkAndSetUserCmdBlock('EXAMPLE_USER_NAME', 'EXAMPLE_USER_ID')}

  ${shSupport.wrapCmdBlock('echo 1')}

  ${shSupport.checkEnvsCmdBlock(['FURULYA', 'NYENYERE'])}

  ${shSupport.chownCmdBlock('USER_NAME', [__dirname + '/a', __dirname + '/b'], true)}
`

console.log('______________Test Script_______________\n')
console.log(shSupport.normalizeScript(script))

var executableA = `
  ${shSupport.shebang()}

  NYENYERE=1
  FURULYA=2
  ANDRAS_USER=andras
  ANDRAS_USER_ID=1000
  SOME_PATH=${__dirname + '/a'}

  ${shSupport.clearErrorsCmd}
  ${shSupport.checkEnvsCmdBlock(['FURULYA', 'NYENYERE'])}
  ${shSupport.chownCmdBlock('ANDRAS_USER', ['SOME_PATH'])}
  ${shSupport.checkAndSetUserCmdBlock('ANDRAS_USER', 'ANDRAS_USER_ID')}
  ${shSupport.checkDirExistsCmd('SOME_PATH')}
  
  ${shSupport.exitOkCmd}
`
fs.writeFileSync(__dirname + '/example-script-a.sh', shSupport.normalizeScript(executableA))

var executableB = `
  ${shSupport.shebang()}
  ${shSupport.checkDirExistsCmd(shSupport.strToExpr('/opt1'))}
  ${shSupport.exitOkCmd}
`

fs.writeFileSync(__dirname + '/example-script-b.sh', shSupport.normalizeScript(executableB))
