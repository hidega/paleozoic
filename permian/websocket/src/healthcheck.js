var WebSocket = require('ws')
var commons = require('./commons')

module.exports = (address, timeoutMs, callback) => {
  if (!callback) {
    callback = timeoutMs
    timeoutMs = 5000
  }

  try {
    var token = commons.uuid()
    var ws = new WebSocket(address)

    var to = setTimeout(() => {
      ws.close(0)
      callback(1)
    }, timeoutMs)

    ws.on('error', callback)

    ws.on('pong', data => {
      if (data.toString() === token) {
        ws.close()
        clearTimeout(to)
        callback()
      }
    })

    ws.on('open', () => ws.ping(token))
  } catch (e) {
    callback(e)
  }
}
