var throwError = msg => {
  throw new Error(msg)
}

var isString = o => typeof o === 'string' || o instanceof String

var parse = opts => {
  var options = Object.assign({
    mode: 'http',
    boundIp: '127.0.0.1',
    logger: false,
    randomRedirection: false,
    accessLog: false,
    websocketSupport: false,
    port: 8080,
    redirectionTable: [],
    requestMarkerHeader: 'Spec-Mark',
    requestMarker: false,
    pingPath: '/PING',
    incomingRequestTimeoutMs: 5000,
    outgoingRequestTimeoutMs: 5000
  }, opts)
  options.ssl ??= {}
  return options
}

var testHosts = entry => !(Object.keys(entry).includes('hosts') && (!Array.isArray(entry.hosts) || (Array.isArray(entry.hosts) && entry.hosts.length === 0)))

var testPath = entry => !(entry.path && (!entry.path.startsWith('/') || entry.path.includes('//') || entry.path.includes(' ')))

var testSelector = entry => isString(entry.selector) && !(entry.selector.includes('/') || entry.selector.includes(' '))

var testPort = entry => Number.isInteger(entry.port) && entry.port < 65535 && entry.port > 100

var testEntryKeys = entry => !Object.keys(entry).find(key => !['path', 'port', 'websocket', 'hosts', 'selector'].includes(key))

var checkRedirectionTableEntry = (entry, i) => {
  var check = (test, msg) => test(entry) || throwError(msg + ' in redirectionTable #' + i)
  check(testEntryKeys, 'Bad entry')
  check(testSelector, 'Bad or missing selector')
  check(testPort, 'Bad or missing port')
  check(testPath, 'Bad or missing path')
  check(testHosts, 'Empty or invalid hosts')
}

module.exports = opts => {
  var options = parse(opts)
  if(!Array.isArray(options.redirectionTable) || options.redirectionTable.length === 0) {
    throwError('Empty or invalid  redirectionTable')
  }
  options.mode !== 'http' && options.mode !== 'https' && throwError('Mode must be either  http  or  https')
  options.redirectionTable.forEach(checkRedirectionTableEntry)
  return options
}
