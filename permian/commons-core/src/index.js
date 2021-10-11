var bitwise = require('./bitwise')
var math = require('./math')
var date = require('./date')
var random = require('./random')
var proc = require('./proc') 
var string = require('./string')
var lang = require('./lang')

module.exports = { 
  string: Object.freeze(string),
  proc: Object.freeze(proc),
  date: Object.freeze(date),
  random: Object.freeze(random),
  bitwise: Object.freeze(bitwise),
  lang: Object.freeze(lang),
  math: Object.freeze(math)
}
