var os = require('os')
var commonsCore = require('@permian/commons-core')
var { spawnProcess } = require('@permian/runner')
var { execCmd } = require('@permian/runner')

var streamWriteWithTimestamp = (str, stream) => stream.write(`${commonsCore.date.isoDateNow()} ${str}`)

function StreamLogger(owner, stream) {
  var write = (s, r) => {
    streamWriteWithTimestamp(s.toString(), stream)
    r && stream.write(r.toString())
    stream.write('\n')
  }
  this.info = (msg, legend) => write(` [INFO] - (${owner || ''}) - ${msg || ''} : `, legend)
  this.error = (msg, legend) => write(` [ERROR] - (${owner || ''}) - ${msg || ''} : `, legend)
}

function StdLogger(owner) {
  StreamLogger.call(this, owner, process.stdout)
}

StdLogger.mutedInstance = Object.freeze({
  info: () => { },
  error: () => { }
})

var systemPropertiesHash = commonsCore.string.simpleHashNat('' + os.arch() + os.hostname() + JSON.stringify(os.cpus()) + os.type() + JSON.stringify(os.userInfo()) + os.release() + os.platform() + JSON.stringify(os.networkInterfaces()))

var uuid = () => {
  var mu = process.memoryUsage()
  return '' +
    parseInt(Math.random() * 100000) +
    (mu.rss % 100) +
    (os.freemem() % 100000) +
    commonsCore.proc.getSimpleUid() +
    (process.pid + process.ppid + parseInt(Math.random() * 10000)) +
    ((systemPropertiesHash + mu.heapUsed) % 1000000) +
    (Date.now() % 10000000)
}

var uuidHex = () => BigInt(uuid()).toString(16).padStart(32, '0')

var proc = {
  terminateProcess: err => {
    err && console.log('ERROR\n', JSON.stringify(err, null, 2), '\n')
    process.exit(err ? 1 : 0)
  },
  execCmd,
  uuid: uuid().substring(0, 32).padStart(32, '0'),
  uuidHex,
  stdoutWrite: str => process.stdout.write(str),
  StdLogger,
  StreamLogger,
  spawnProcess,
  cwd: process.cwd(),
  stdoutWriteWithTimestamp: str => streamWriteWithTimestamp(str, process.stdout)
}

module.exports = Object.assign({}, commonsCore.proc, proc)
