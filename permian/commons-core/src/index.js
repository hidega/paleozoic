var bitwise = require('./bitwise')
var math = require('./math')
var date = require('./date')
var random = require('./random')
var proc = require('./proc') 
var string = require('./string')
var lang = require('./lang')

module.exports = Object.freeze({ 
  string,
  proc,
  date,
  random,
  bitwise,
  lang,
  math
})
