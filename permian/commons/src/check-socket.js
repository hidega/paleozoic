var net = require('net')

module.exports = (host, port, socketName, timeoutMs, callback) => {
  var socket = new net.Socket()
  var onError = err => {
    socket.destroy()
    callback(err || 'ERROR')
  }
  socket.setTimeout(timeoutMs)
  socket.once('error', onError)
  socket.once('timeout', onError)
  var cb = () => {
    socket.end()
    callback(false)
  }
  socketName ? socket.connect(socketName, cb) : socket.connect(port, host, cb)
}
