var os = require('os')
var commonsCore = require('@permian/commons-core')

var UUID_LEN = 32

var systemPropertiesHash = commonsCore.string.simpleHashNat('' + os.arch() + os.hostname() +
  JSON.stringify(os.cpus()) + os.type() + JSON.stringify(os.userInfo()) + os.release() +
  os.platform() + JSON.stringify(os.networkInterfaces()))

var sessionId = parseInt(Math.random() * 1000)

var uuid = () => {
  var mu = process.memoryUsage()
  var u = '' +
    parseInt(Math.random() * 100000) +
    (mu.rss % 100) +
    (os.freemem() % 10000) +
    sessionId +
    commonsCore.proc.getSimpleUid() +
    (process.pid + process.ppid + parseInt(Math.random() * 10000)) +
    ((systemPropertiesHash + mu.heapUsed) % 100000) +
    (Date.now() % 10000000)
  return u.padStart(UUID_LEN, '0').substr(0, UUID_LEN)
}

var uuidHex = () => BigInt(uuid()).toString(16).padStart(UUID_LEN, '0')

module.exports = { uuid, uuidHex, UUID_LEN }
