var runner = require('..')
var assert = require('assert')

var caseExec = () => runner.execCmd('echo', ['"execCmd()"', '>', './out.txt'])

var caseExecShell = () => runner.execShellCmd('echo "Hello World" >> ./out.txt')

var caseExecFile = () => runner.execFile('./cmd.sh')

var caseSpawn = () => runner.spawnProcess('/bin/touch', ['file.txt'])

caseExec().then(() => caseSpawn())
  .then(() => caseExecFile())
  .then(() => caseExecShell())
  .then(() => console.log('OK'))
  .catch(e => {
    console.error('ERROR:\n', e)
    process.exit(1)
  })

