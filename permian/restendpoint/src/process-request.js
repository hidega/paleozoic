var url = require('url')
var commons = require('./commons')
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

var createContext = (reqParams, handler) => {
  var ctx = handler(reqParams, ContextFactory.newInstance())
  return ctx || defaultContext
}

var getPath = request => [request.method].concat(url.parse(request.url).pathname.split('/').splice(1))

var handleError = (e, n, response, logger) => {
  logger.error(e, n)
  response.writableEnded || response.end(('ERROR: ' + n + ' ' + JSON.stringify(e)).substr(0, 80))
}

var onBadHandler = params => {
  params.logger.error(`Missing or corrupt handler for ${getPath(params.request).join('/')}`, 4)
  flushResponse(params.response, {
    statusCode: 4,
    status: `Handler not found: ${params.request.method}`,
    httpStatusCode: http.STATUS_NOT_FOUND
  })
}

var handleRequest = (handlerInfo, params) => {
  var reqParams = RequestParameters.newInstance(params.request, params.response, params.logger, handlerInfo.pos)
  var context = createContext(reqParams, handlerInfo.handler)
  var head = { [http.HEADER_CONTENTTYPE]: context.contentType }
  context.encoding && (head[http.HEADER_CONTENTENCODING] = context.encoding)
  params.response.writeHead(context.statusCode, head)
  var errorHandler = e => handleError(e, 3, params.response, params.logger)
  var r = commons.try(() => context.processor(params.request, params.response), errorHandler)
  r && commons.isPromise(r) && r.catch(errorHandler)
}

module.exports = params => {
  params.request.on('error', e => handleError(e, 1, params.response, params.logger))
  params.response.on('error', params.logger.error)
  var handlerInfo = findHandler(params.handlers, getPath(params.request))
  commons.isFunction(handlerInfo.handler) ? handleRequest(handlerInfo, params) : onBadHandler(params)
}
