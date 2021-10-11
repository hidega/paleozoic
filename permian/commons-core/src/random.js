var rndStrAlpahanum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

module.exports = {
  rndNat: (a, b) => {
    var result = 0
    if (a) {
      a = Math.abs(a)
      b = !b ? 0 : b
      b = b >= 0 ? b : -b
      a < b || [a, a = b][0]
      result = Math.floor((Math.random() * (a - b)) + a)
    }
    return result
  },
  rndString: (len, base) => {
    base ??= rndStrAlpahanum
    var result = ''
    for (; result.length < len; result += base[Math.floor(Math.random() * base.length)]) {}
    return result
  }
}
