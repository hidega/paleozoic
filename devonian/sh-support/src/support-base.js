var SHEBANG = '#!/bin/sh'

var parseParams = p => Object.assign({
  errorFile: '/tmp/devonian-script-error.txt',
  errorExitCode: 1
}, p)

function ShSupportBase(p, params = parseParams(p)) {
  this.wrapCmdBlock = cmds => cmds ? `\n{\n${cmds}\n}\n` : '\n'

  this.shebang = () => `${SHEBANG}\n\n# generated on ${new Date().toISOString()}\n\n`

  this.clearErrorsCmd = `rm -f ${params.errorFile}\n`

  this.singleQuote = s => `'${s}'`

  this.thisDirExpr = `"$(dirname "$(readlink -f "$0")")"`

  this.su = (userVar, cmd) => `su - $${userVar} -c "${cmd}" `

  this.redirectToNullExpr = ' > /dev/null 2>&1 '

  this.exitOkCmd = 'exit 0'

  this.exitErrorCmd = msg => ` { echo "$(date -uIseconds) | ERROR: ${msg}" > ${params.errorFile}; exit ${params.errorExitCode}; }`

  this.exitErrorIfLastFailedCmd = msg => ` { [ "$?" -ne "0" ] && ${this.exitErrorCmd(msg)}; } `

  this.normalizeScript = (s, script = s || '') => script.replace(/\n( )*\n( )*\n/g, '\n\n')
    .replace(new RegExp('^[ \n]+' + SHEBANG), SHEBANG)
    .replace(/\n\{\n( )*\n/g, '\n{\n')
    .replace(/\n( )*\n\}\n/g, '\n}\n')
}

module.exports = ShSupportBase
