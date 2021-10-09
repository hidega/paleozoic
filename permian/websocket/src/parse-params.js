module.exports = p => {
  var logger = Object.assign({
    info: () => {},
    error: () => {}
  }, p.logger)

  var handlers = Object.assign({
    onConnection: () => {},
    onMessage: () => {},
    onClose: () => {},
    onOpen: () => {},
    onError: () => {},
  }, p.handlers)

  var params = Object.assign({
    maxMsgPayloadBytes: 65535,
    maxConnections: 64,
    connQueueMaxLen: 64,
    requestTimeoutMs: 10000,
    host: '127.0.0.1',
    port: 37590
  }, p)
  params.logger = logger
  params.handlers = handlers
  return params
}
