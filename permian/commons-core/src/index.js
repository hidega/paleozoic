var bitwise = require('./bitwise')
var math = require('./math')
var date = require('./date')
var random = require('./random')
var proc = require('./proc') 
var test = require('./test') 
var string = require('./string')
var lang = require('./lang')

module.exports = { 
  string: Object.freeze(string),
  proc: Object.freeze(proc),
  date: Object.freeze(date),
  random: Object.freeze(random),
  bitwise: Object.freeze(bitwise),
  lang: Object.freeze(lang),
  test: Object.freeze(test),
  math: Object.freeze(math)
}
