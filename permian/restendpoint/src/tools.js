var commons = require('./commons')
var http = require('./http')

var createError = (msg, code) => ({
  error: 1,
  message: msg || 'Error',
  code: code || -1
})

var pingServer = (err, response, callback) => {
  var resp = commons.try(() => JSON.parse(response.toString()), () => err = 'cannot parse response')
  err = commons.isEqual(resp, http.PING_OK) ? false: 'bad ping'
  callback(err)
}

var pingHttpServer = (url, callback) => commons.httpGet(url, (err, response) => pingServer(err, response, callback))

var pingHttpsServer = (url, callback) => commons.httpsGet(url, (err, response) => pingServer(err, response, callback))

var tools = {
  pingTimeoutMs: 5000,
  pingPort: (host, port, callback) => commons.checkIfPortIsReachable(host, port, tools.pingTimeoutMs, callback),
  pingHttpService: (uri, callback) => uri.startsWith('http:') ? commons.httpGet(uri, callback) : commons.throwError('Bad URI'),
  pingHttpsService: (uri, callback) => uri.startsWith('https:') ? commons.httpsGet(uri, callback) : commons.throwError('Bad URI'),
  OK: 'OK',
  NOT_OK: 'NOT_OK',
  pingHttpServer,
  pingHttpsServer,
  responseJsonObject: (contextFactory, statusCode, obj) => contextFactory.emptyToBuffer()
    .setContentType(http.CONTENTTYPE_JSON)
    .setStatusCode(obj ? (statusCode || http.STATUS_OK) : http.STATUS_OK)
    .process(() => obj || statusCode || { message: 1 }),
  responseJsonOk: contextFactory => tools.responseJsonObject(contextFactory, { result: tools.OK }),
  responseJsonNotOk: contextFactory => tools.responseJsonObject(contextFactory, { result: tools.NOT_OK }),
  responseJsonError: {
    notFound: (contextFactory, msg) => tools.responseJsonObject(contextFactory, http.STATUS_NOT_FOUND, createError(msg || 'Not found', http.STATUS_NOT_FOUND)),
    serverError: (contextFactory, msg) => tools.responseJsonObject(contextFactory, http.STATUS_ERROR, createError(msg || 'Server error', http.STATUS_ERROR)),
    forbidden: (contextFactory, msg) => tools.responseJsonObject(contextFactory, http.STATUS_FORBIDDEN, createError(msg || 'Forbidden', http.STATUS_FORBIDDEN)),
    badRequest: (contextFactory, msg) => tools.responseJsonObject(contextFactory, http.STATUS_BAD_REQUEST, createError(msg || 'Bad request', http.STATUS_BAD_REQUEST))
  }
}

module.exports = Object.freeze(tools)
