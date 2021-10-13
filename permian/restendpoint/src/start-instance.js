var http = require('http')
var httpConstants = require('./http')
var commons = require('./commons')
var flushResponse = require('./flush-response')
var processRequest = require('./process-request')
var parseCfg = require('./parse-cfg')
var validateHandlers = require('./validate-handlers')

var createLogger = cfg => cfg.logToStdout ? commons.StdLogger.newInstance('restendpoint: ' + cfg.id.substr(0, 16)) : commons.StdLogger.mutedInstance

var checkPing = p => p.request.method === httpConstants.GET && p.request.url === ('/' + httpConstants.PING_PATH) 

var answerPing = p => {
  p.response.writeHead(httpConstants.STATUS_OK)
  p.response.end(JSON.stringify(httpConstants.PING_OK))
}

var onRequest = commons.matcherBuilder()
  .on(checkPing, answerPing)
  .on(p => httpConstants.ALLOWED_METHODS.includes(p.request.method), p => processRequest(p))
  .otherwise(p => flushResponse(response, {
    statusCode: 4,
    status: `Method not allowed: ${p.request.method}`,
    httpStatusCode: httpConstants.STATUS_METHOD_NOT_ALLOWED
  }))
  .build()

var getRequestHandler = (handlers, logger) => (request, response) => onRequest({ handlers, logger, request, response })

var startHttpServer = (handlers, logger, cfg) => http.createServer(getRequestHandler(handlers, logger))
  .listen(cfg.port, cfg.host)
  .on('error', e => logger.error(`#2 : ${e}`))

var createServer = (cfg, handlers, logger) => {
  var httpServer = startHttpServer(handlers, logger, cfg)
  httpServer.setTimeout(cfg.requestTimeoutMs)
  httpServer.maxConnections = cfg.maxConnections
  logger.info(`Server started with config:\n${JSON.stringify(cfg, null, 2)}`)
  return httpServer
}

var shutdownServer = (httpServer, logger, serverShutdownTimeoutMs) => {
  httpServer.setTimeout(serverShutdownTimeoutMs)
  httpServer.close()
  httpServer = false
  logger.info('Server was stopped')
  logger = false
}

module.exports = (requestHandlers, cfg) => {
  var handlers = validateHandlers(requestHandlers)
  var configuration = parseCfg(cfg)
  var logger = createLogger(configuration)
  var httpServer = createServer(configuration, handlers, logger)
  return {
    configuration,
    stop: () => {
      shutdownServer(httpServer, logger, configuration.serverShutdownTimeoutMs)
      handlers = false
    }
  }
}
