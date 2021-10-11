var proc = require('./proc')
var compress = require('./compress')
var files = require('./files')
var platform = require('./platform')
var net = require('./net')
var stream = require('./stream')

module.exports = {
  platform: Object.freeze(platform),
  compress: Object.freeze(compress),
  files: Object.freeze(files),
  net: Object.freeze(net),
  stream: Object.freeze(stream),
  proc: Object.freeze(proc)
}
