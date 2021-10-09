var http = require('http')
var commons = require('./commons')
var flushResponse = require('./flush-response')
var processRequest = require('./process-request')
var parseCfg = require('./parse-cfg')
var validateHandlers = require('./validate-handlers')

var createLogger = cfg => commons.when(cfg.logToStdout)
  .isNil(commons.StdLogger.mutedInstance)
  .otherwise(new commons.StdLogger('restendpoint: ' + cfg.id.substr(0, 16)))

var startHttpServer = (handlers, logger, cfg) => http.createServer((request, response) => commons.when(['GET', 'POST', 'PUT', 'DELETE'].includes(request.method))
    .then(() => processRequest(request, response, handlers, logger))
    .otherwise(() => flushResponse(response, {
      statusCode: 4,
      status: `Method not allowed: ${request.method}`,
      httpStatusCode: 405
    })))
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
    stop: () => {
      shutdownServer(httpServer, logger, configuration.serverShutdownTimeoutMs)
      handlers = false
    }
  }
}
