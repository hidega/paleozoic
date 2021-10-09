var WebSocket = require('ws')
var http = require('http')
var https = require('https')
var commons = require('./commons')
var parseParams = require('./parse-params')

function Server() {}

function WebsocketWrapper(ws, params) {
  var data = {}

  this.clientIp = Object.assign([], params.clientIp)

  this.uid = Object.freeze(commons.uuid())

  this.send = msg => ws.send(msg)

  this.close = code => {
    commons.disableDeclaredFunctions(this)
    ws.close(code)
  }

  this.getBufferedAmount = () => ws.bufferedAmount

  this.setData = d => data = d

  this.getData = () => data
}

Server.start = p => {
  var params = parseParams(p)

  params.serverMode = 'http'

  params.serverMode !== 'http' && params.serverMode !== 'https' && commons.throwError('serverMode must be either http or https')

  var server = (params.serverMode === 'http' ? http : https).createServer()
  server.setTimeout(params.requestTimeoutMs)
  server.maxConnections = params.maxConnections
  server.listen(params.port, params.host)

  var wsServer = new WebSocket.Server({
    maxPayload: params.maxMsgPayloadBytes,
    backlog: params.connQueueMaxLen,
    server
  })

  wsServer.on('connection', (ws, req) => {
    var wrapper = new WebsocketWrapper(ws, {
      clientIp: [
        req.connection.remoteAddress,
        req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]
      ]
    })

    params.handlers.onConnection(wrapper, req)

    ws.on('error', err => {
      params.logger.error(`Server error for socket#${ws.uid} : ${err}`)
      params.handlers.onError(wrapper, err)
    })

    ws.on('message', msg => params.handlers.onMessage(wrapper, msg))

    ws.on('close', code => {
      params.logger.info(`socket#${ws.uid} was closed with code ${code}`)
      params.handlers.onClose(wrapper, code)
    })

    ws.on('open', () => {
      params.logger.info(`socket#${ws.uid} was opened`)
      params.handlers.onOpen(wrapper)
    })
  })

  wsServer.on('error', err => params.logger.error('Server error: ' + err))

  params.logger.info('Server started with parameters: ' + JSON.stringify(params, null, 1))

  return () => {
    server.setTimeout(2000)
    server.close()
    wsServer.close()
    params.logger.info('Server was closed.')
  }
}

module.exports = Server
