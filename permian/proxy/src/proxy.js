var https = require('https')
var http = require('http')
var httpProxy = require('http-proxy')
var createRedirectUrl = require('./create-redirect-url')
var parseOptions = require('./parse-opts')

var createProxy = (options, log) => {
  var proxy = httpProxy.createServer({
    proxyTimeout: options.outgoingRequestTimeoutMs,
    timeout: options.incomingRequestTimeoutMs,
    ws: options.websocketSupport
  })
  proxy.on('error', e => log('ERROR', e))
  return proxy
}

var createTargetFinder = redirectionTable => (url, ws) => {
  var target = false
  var newPath = false
  var indexFound = redirectionTable.findIndex(entry => {
    var ret = false
    var ru = createRedirectUrl(url, entry)
    if (ru && ((entry.websocket && ws) || (!entry.websocket && !ws))) {
      newPath = ru.path
      target = ru.location
      ret = true
    }
    return ret
  })
  return { indexFound, target, newPath }
}

var createRequestHandler = (pingPath, accessLog, proxy, markRequest, findTarget) => (req, res) => {
  var origUrl = req.url
  if (req.url === pingPath) {
    res.write('OK')
    res.end()
    accessLog('Pinged', req.connection.remoteAddress, origUrl, pingPath)
  } else {
    var { indexFound, target, newPath } = findTarget(origUrl)
    if (indexFound === -1) {
      res.write('NOTFOUND')
      res.end()
    } else {
      req.url = newPath
      markRequest(req, origUrl)
      proxy.web(req, res, { target })
    }
    accessLog(indexFound === -1 ? 'Not found' : 'Requested', req.connection.remoteAddress, origUrl, target + newPath)
  }
}

var createUpgradeHandler = (findTarget, proxy, accessLog, log) => (req, socket, head) => {
  var { indexFound, target, newPath } = findTarget(req.url, true)
  if (indexFound === -1) {
    log('ERROR', 'url path not recognized: ' + req.url)
    socket.destroy()
  } else {
    req.url = newPath
    proxy.ws(req, socket, head, { target })
  }
  accessLog(indexFound === -1 ? 'Not found' : 'Requested', req.connection.remoteAddress, req.url, target + newPath)
}

var startServer = (options, requestHandler, upgradeHandler, log) => {
  var server = false

  if (options.mode === 'http') {
    server = http.createServer(requestHandler).listen(options.port, options.boundIp)
  } else if (options.mode === 'https') {
    var httpsOptions = { key: options.ssl.key, cert: options.ssl.cert }
    options.ssl.ca && (httpsOptions.ca = options.ssl.ca)
    if (options.ssl.requestCert) {
      httpsOptions.requestCert = options.ssl.requestCert
      httpsOptions.rejectUnauthorized = options.ssl.rejectUnauthorized
    }
    server = https.createServer(httpsOptions, requestHandler).listen(options.port, options.boundIp)
  } else {
    throw new Error(`Invalid mode: ${options.mode} ; 'http' or 'https' was expected`)
  }

  options.websocketSupport && server.on('upgrade', upgradeHandler)

  server.on('error', e => log('ERROR', e))

  return server
}

var startProxy = opts => {
  var options = parseOptions(opts)
  var log = options.logger ? (category, msg) => options.logger(`[${category}] ${Date.now()} - ${msg}`) : () => {}
  var accessLog = options.accessLog ? (msg, from, reqUrl, redirUrl) => log('ACCESS', `Target: ${reqUrl} -> ${redirUrl} | From: ${from} | ${msg}`) : () => {}
  var markRequest = options.requestMarker ? (req, origUrl) => req.headers[options.requestMarkerHeader.toLowerCase()] = options.requestMarker(req.url, origUrl) : () => {}
  var proxy = createProxy(options, log)
  var findTarget = createTargetFinder(options.redirectionTable)
  var requestHandler = createRequestHandler(options.pingPath, accessLog, proxy, markRequest, findTarget)
  var upgradeHandler = createUpgradeHandler(findTarget, proxy, accessLog, log)
  var server = startServer(options, requestHandler, upgradeHandler, log)
  log('INFO', 'proxy started with parameters: ' + JSON.stringify(options))
  return () => {
    proxy.close()
    server.setTimeout(2000)
    server.close()
  }
}

module.exports = startProxy
