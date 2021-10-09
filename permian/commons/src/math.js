var bitwise = require('./bitwise')
var _ = require('./lodash')

module.exports = {
  divides: (d, n) => n % d === 0,
  square: number => number * number,
  halfFloor: number => bitwise.shiftRight(number),
  power: (base, exp) => {
    var result = base === 0 ? 0 : 1
    if (!(exp <= 0 || base < 0)) {
      result = base
      for (; --exp > 0; result *= base) {}
    }
    return result
  },
  cube: number => number * number * number,
  compareFloats: (a, b, threshold) => Math.abs(Number(a) - Number(b)) < (threshold || 0.0000001),
  toSafeInteger: number => _.toSafeInteger(number),
  isEven: nat => bitwise.and(nat, 1) === 0,
  min: _.min,
  max: _.max,
  clamp: _.clamp,
  random: _.random,
  isOdd: nat => bitwise.and(nat, 1) === 1,
  betweenInclusive: (n, a, b) => _.isNumber(a) && _.isNumber(b) && _.isNumber(n) && a <= n && n <= b,
  betweenExclusive: (n, a, b) => _.isNumber(a) && _.isNumber(b) && _.isNumber(n) && a < n && n < b,
  intDiv: (a, b) => (a / b) | 0
}
