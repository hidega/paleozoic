var commonsCore = require('@permian/commons-core')
var { spawnProcess } = require('@permian/runner')
var { execCmd } = require('@permian/runner')
var uid = require('./uid')

var streamWriteWithTimestamp = (str, stream) => stream.write(`${commonsCore.date.isoDateNow()} ${str}`)

var createStreamLogger = (owner, stream) => {
  var write = (s, r) => {
    streamWriteWithTimestamp(s.toString(), stream)
    r && stream.write(r.toString())
    stream.write('\n')
  }
  return Object.freeze({
    info: (msg, legend) => write(` [INFO] - (${owner || ''}) - ${msg || ''} : `, legend),
    error: (msg, legend) => write(` [ERROR] - (${owner || ''}) - ${msg || ''} : `, legend)
  })
}

var StreamLogger = Object.freeze({ newInstance: createStreamLogger })

var StdLogger = Object.freeze({
  mutedInstance: Object.freeze({
    info: () => { },
    error: () => { }
  }),
  newInstance: owner => createStreamLogger(owner, process.stdout)
})


var proc = {
  terminateProcess: err => {
    err && console.log('ERROR\n', JSON.stringify(err, null, 2), '\n')
    process.exit(err ? 1 : 0)
  },
  execCmd,
  uuid: uid.uuid,
  uuidHex: uid.uuidHex,
  UUID_LEN: uid.UUID_LEN,
  stdoutWrite: str => process.stdout.write(str),
  StdLogger,
  StreamLogger,
  spawnProcess,
  cwd: process.cwd(),
  stdoutWriteWithTimestamp: str => streamWriteWithTimestamp(str, process.stdout)
}

module.exports = Object.assign({}, commonsCore.proc, proc)
