var bitwise = {
  Base64w: {
    encode: obj => Buffer.from(obj).toString('base64').replace(/[\=\/]/g, c => c === '/' ? '~' : '_'),
    decode: obj => Buffer.from(obj.replace(/[\_\~]/g, c => c === '~' ? '/' : '='), 'base64')
  },
  Base62: {
    encode: obj => Buffer.from(Buffer.from(obj).toString('base64').replace(/[\=\/\+0]/g, c => {
      var result = '04'
      if (c === '/') {
        result = '01'
      } else if (c === '+') {
        result = '02'
      } else if (c === '=') {
        result = '03'
      }
      return result
    })),
    decode: obj => Buffer.from(obj.replace(/(01|02|03|04)/g, c => {
      var result = '0'
      if (c === '01') {
        result = '/'
      } else if (c === '02') {
        result = '+'
      } else if (c === '03') {
        result = '='
      }
      return result
    }), 'base64')
  },
  hexaDigits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
  checkBit: (num, n) => (num & (1 << n)) === 0 ? 0 : 1,
  nthPowerOfTwo: n => 1 << n,
  xor: (a, b) => a ^ b,
  or: (a, b) => a | b,
  and: (a, b) => a & b,
  not: a => ~a,
  shiftRight: (num, n) => num >> (n ? n : 1),
  shiftLeft: (num, n) => num << (n ? n : 1),
  highestBitOfNat: naturalNumber => {
    var result = -1
    var i = 32
    while (result === -1 && --i > -1) {
      if (bitwise.checkBit(naturalNumber, i)) result = i
    }
    return result
  },
  one: 1,
  zero: 0,
  bufferToSimpleArray: b => Array.prototype.slice.call(b)
}

module.exports = bitwise
