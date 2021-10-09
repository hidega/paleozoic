var selectorRegexp = new RegExp('^\\/([a-zA-Z0-9_\\-\\.])+\\/')

var findSelector = requestPath => {
  var sel = selectorRegexp.exec(requestPath)
  return sel ? sel[0].substr(1, sel[0].length - 2) : requestPath.replace('/', '')
}

var parseRequest = fullpath => {
  fullpath.endsWith('?') && (fullpath = fullpath.substr(0, fullpath.length - 1))
  var i = fullpath.indexOf('?')
  return {
    requestPath: i === -1 ? fullpath : fullpath.substr(0, i),
    requestParameters: i === -1 ? '' : fullpath.substr(i, i.length)
  }
}

var getRedirHost = redirEntry => redirEntry.hosts && redirEntry.hosts.length > 0 ? redirEntry.hosts[parseInt(Math.random() * redirEntry.hosts.length)] : 'http://127.0.0.1' 

module.exports = (fullpath, redirEntry) => {
  var retval = false
  var { requestPath, requestParameters } = parseRequest('' + fullpath)
  if (findSelector(requestPath) === redirEntry.selector) {
    retval = { 
      path: '',
      location: getRedirHost(redirEntry) + ':' + redirEntry.port
    }
    var additionalPath = requestPath.substr(redirEntry.selector.length + 2, requestPath.length)
    if (redirEntry.path) {
      retval.path = redirEntry.path || ''
      additionalPath && (retval.path += '/' + additionalPath)
    } else if (additionalPath) {
      retval.path = additionalPath
    }
    retval.path += requestParameters
  }
  return retval
}
