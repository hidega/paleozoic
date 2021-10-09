var bitwise = require('./bitwise')
var math = require('./math')
var date = require('./date')
var random = require('./random')
var proc = require('./proc')
var compress = require('./compress')
var string = require('./string')
var files = require('./files')
var platform = require('./platform')
var lang = require('./lang')
var net = require('./net')
var stream = require('./stream')

module.exports = Object.freeze({
  platform,
  compress,
  files,
  string,
  date,
  random,
  bitwise,
  lang,
  math,
  net,
  stream,
  proc
})
