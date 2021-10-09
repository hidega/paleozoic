var zlib = require('zlib')
var util = require('util')

module.exports = {
  gzip: (buffer, callback) => callback ? zlib.gzip(buffer, callback) : zlib.gzipSync(buffer),
  gzipPromise: util.promisify(zlib.gzip),
  gunzip: (buffer, callback) => callback ? zlib.gunzip(buffer, callback) : zlib.gunzipSync(buffer),
  gunzipPromise: util.promisify(zlib.gunzip)
}
