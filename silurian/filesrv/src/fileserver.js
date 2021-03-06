var restEndpoint = require('@permian/restendpoint')
var handleGetFile = require('./get-file')
var handleListDirectory = require('./list-directory')
var ping = require('./healthcheck')
var parseParameters = require('./parse-parameters')
var extractPath = require('./extract-path')
var mimeTypes = require('./ext-mtype')
var commons = require('./commons')

var isZipped = parameters => parameters.zipped && (parameters.zipped === '1' || parameters.zipped === 'true' || parameters.zipped === 'yes')

var FileServer = {}

FileServer.start = p => {
  var serviceParams = parseParameters(p)
  var contentTypes = Object.assign(mimeTypes, serviceParams.additionalTypeMappings)
  var getPath = pa => extractPath(pa, serviceParams.fileServer.baseDir)
  var handlers = restEndpoint.prependPathToHandlers(serviceParams.restEndpoint.urlBasePath, {
    GET: { 
      [commons.requestPath.getFile]: (parameters, contextFactory) => handleGetFile(contextFactory, getPath(parameters), isZipped(parameters.getRequestParameters()), contentTypes),
      [commons.requestPath.listDirectory]: (parameters, contextFactory) => handleListDirectory(contextFactory, getPath(parameters), serviceParams.fileServer.allowDirectoryListing)
    }
  })
  return restEndpoint.startInstance(handlers, serviceParams.restEndpoint)
}

FileServer.ping = ping

FileServer.ZIP_IMPLEMENTATION = 'gzip'

module.exports = Object.freeze(FileServer)
