var url = require('url')
var commons = require('./commons')
var { when } = commons
var http = require('./http')
var RequestParameters = require('./req-params')
var flushResponse = require('./flush-response')
var ContextFactory = require('./context-factory')
var findHandler = require('./find-handler')

var defaultContext = {
  contentType: http.CONTENTTYPE_OCTET_STREAM,
  statusCode: http.STATUS_OK,
  processor: (request, response) => Promise.resolve(response.end('0'))
}

var createContext = (reqParams, handler) => when(handler(reqParams, new ContextFactory()))
  .isNil(defaultContext)
  .otherwise(o => o)

var getPath = request => [request.method].concat(url.parse(request.url).pathname.split('/').splice(1))

var handleError = (e, n, response, logger) => {
  logger.error(e, n)
  response.writableEnded || response.end(('ERROR: ' + n + ' ' + JSON.stringify(e)).substr(0, 80))
}

var onBadHandler = (request, response, logger) => {
  logger.error(`Missing or corrupt handler for ${getPath(request).join('/')}`, 4)
  flushResponse(response, {
    statusCode: 4,
    status: `Handler not found: ${request.method}`,
    httpStatusCode: http.STATUS_NOT_FOUND
  })
}

var handleRequest = (handlerInfo, request, response, logger) => {
  var reqParams = new RequestParameters(request, response, logger, handlerInfo.pos)
  var context = createContext(reqParams, handlerInfo.handler)
  var head = {
    [http.HEADER_CONTENTTYPE]: context.contentType
  }
  context.encoding && (head[http.HEADER_CONTENTENCODING] = context.encoding)
  response.writeHead(context.statusCode, head)
  context.processor(request, response).catch(e => handleError(e, 3, response, logger))
}

module.exports = (request, response, handlers, logger) => {
  request.on('error', e => handleError(e, 1, response, logger))
  response.on('error', logger.error)
  var handlerInfo = findHandler(handlers, getPath(request))
  when(commons.isFunction(handlerInfo.handler))
    .then(() => handleRequest(handlerInfo, request, response, logger))
    .otherwise(() => onBadHandler(request, response, logger))
}
