var _ = require('./lodash')
var lang = require('./lang')

var string = {
  simpleHashNat: str => Math.abs(str.split('').map(v => v.charCodeAt(0)).reduce((a, v) => a + ((a << 7) + (a << 3)) ^ v)),
  simpleHash: str => (str.length % 256).toString(16).padStart(2, '0') + string.simpleHashNat(str).toString(16).padStart(8, '0'),
  splitToChars: str => str.split(''),
  isNonemptyStr: o => _.isString(o) && o.length > 0,
  reverse: str => string.splitToChars(str).reverse().join(''),
  equalIgnoreCase: (r, s) => _.isString(r) && _.isString(s) && r.toLowerCase() === s.toLowerCase(),
  equalTrimmed: (r, s) => _.isString(r) && _.isString(s) && r.trim() === s.trim(),
  byteArrayToString: ba => ba.map(c => String.fromCharCode(c)).join(''),
  stringToByteArray: str => str === '' ? [] : str.split('').map(c => c.charCodeAt(0)),
  iterateOver: (str, f, terminate) => lang.countLoop(str.length, i => f(str.charAt(i)), terminate)
}

module.exports = string
