var query = require('@permian/query')

module.exports = (opts, callback) => {
  var h = opts.mode === 'https' ? query.https : query.http
  var url = opts.mode + '://' + opts.boundIp + ':' + opts.port + opts.pingPath
  h.get(url, callback)
}

