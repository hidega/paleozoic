var { spawn } = require('child_process')

var parseOptions = opts => {
  var options = Object.assign({
    spawnOpts: {},
    setOutput: () => {},
    consoleOutput: true,
    waitForExit: true,
    onExit: () => {},
    collectData: true
  }, opts)

  options.uid && (options.spawnOpts.uid = options.uid)
  options.gid && (options.spawnOpts.gid = options.gid)

  return options
}

module.exports = (cmdPath, args, opts) => new Promise((resolve, reject) => {
  args = args || []

  var options = parseOptions(opts)

  var proc = spawn(cmdPath, args, options.spawnOpts)

  var output = { error: '', info: '' }

  proc.on('error', err => {
    output.error += 'Runtime error: \n' + JSON.stringify(err, null, 1).replace(/\\\\/g, '\\')
    reject(output)
  })

  if (options.collectData) {
    proc.stdout.on('data', data => output.info += data)
    proc.stderr.on('data', data => output.error += data)
  }

  proc.on('exit', (code, signal) => options.waitForExit ? resolve({ code, output, proc, signal }) : options.onExit({ code, output, proc, signal }))

  options.setOutput(proc.stdout, proc.stderr)

  options.waitForExit || resolve({ code: proc.pid, output, proc })
})
