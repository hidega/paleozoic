var os = require('os')
var _ = require('./lodash')
var string = require('./string')
var date = require('./date')
var Fsa = require('./fsa')
var ThrottlingController = require('./throttling-controller')
var {spawnProcess} = require('@permian/runner')
var {execCmd} = require('@permian/runner')

var simpleUid = BigInt(0)

var streamWriteWithTimestamp = (str, stream) => stream.write(`${date.isoDateNow()} ${str}`)

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
  info: () => {},
  error: () => {}
})

var systemPropertiesHash = string.simpleHashNat('' + os.arch() + os.hostname() + JSON.stringify(os.cpus()) + os.type() + JSON.stringify(os.userInfo()) + os.release() + os.platform() + JSON.stringify(os.networkInterfaces()))

var uuid = () => {
  var mu = process.memoryUsage()
  return '' +
    parseInt(Math.random() * 1000000) +
    (mu.rss % 100) +
    (os.freemem() % 100000) +
    _.uniqueId() +
    (process.pid + process.ppid + parseInt(Math.random() * 10000)) +
    ((systemPropertiesHash + mu.heapUsed) % 1000000) +
    (Date.now() % 10000000)
}

var uuidHex = () => BigInt(uuid()).toString(16).padStart(32, '0')

module.exports = {
  setTimeoutPr: (f, timeout) => new Promise((resolve, reject) => setTimeout(() => {
    f()
    resolve()
  }, timeout)),
  terminateProcess: err => {
    err && console.log('ERROR\n', JSON.stringify(err, null, 2), '\n')
    process.exit(err ? 1 : 0)
  },
  uuid: uuid().substring(0, 32).padStart(32, '0'),
  uuidHex,
  stdoutWrite: str => process.stdout.write(str),
  sleep: (timeoutMs, callback) => callback ? setTimeout(callback, timeoutMs) : new Promise(r => setTimeout(r, timeoutMs)),
  StdLogger: Object.freeze(StdLogger),
  StreamLogger,
  spawnProcess,
  cwd: process.cwd(),
  Fsa,
  execCmd,
  getSimpleUid: () => {
    simpleUid = simpleUid + BigInt(1)
    return simpleUid.toString()
  },
  ThrottlingController,
  stdoutWriteWithTimestamp: str => streamWriteWithTimestamp(str, process.stdout)
}
