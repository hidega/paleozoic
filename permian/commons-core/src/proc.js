var _ = require('./lodash')
var Fsa = require('./fsa')
var ThrottlingController = require('./throttling-controller')

var simpleUid = BigInt(0)

var sessionId = '' + parseInt(Math.random() * 100000)

var uidlen = 32

var uuid = () => {
  var u = sessionId + parseInt(Math.random() * 100000000) + _.uniqueId() + (Date.now() % 1000000000)
  u = u.substring(0, uidlen).padStart(uidlen, '0')
  var result = ''
  for (var i = 0; i < uidlen / 2; i++) {
    result += u[i] + u[uidlen - i - 1]
  }
  return result;
}

var uuidHex = () => BigInt(uuid()).toString(16).padStart(uidlen, '0')

module.exports = Object.freeze({
  setTimeoutPr: (f, timeout) => new Promise(resolve => setTimeout(() => {
    f()
    resolve()
  }, timeout)),
  uuid,
  uuidHex,
  sleep: (timeoutMs, callback) => callback ? setTimeout(callback, timeoutMs) : new Promise(r => setTimeout(r, timeoutMs)),
  Fsa,
  uidlen,
  getSimpleUid: () => {
    simpleUid = simpleUid + BigInt(1)
    return simpleUid.toString()
  },
  ThrottlingController
})
