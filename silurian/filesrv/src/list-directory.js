var fs = require('fs')
var restEndpoint = require('@permian/restendpoint')
var commons = require('./commons')

var getType = commons.matcherBuilder()
  .on(e => e.isDirectory(), commons.fileTypes.TYPE_DIR)
  .on(e => e.isFile(), commons.fileTypes.TYPE_FILE)
  .otherwise(commons.fileTypes.TYPE_OTHER)
  .build()

var processEntries = (entries, contextFactory) => contextFactory.emptyToBuffer()
    .setContentType(restEndpoint.http.CONTENTTYPE_JSON)
    .setStatusCode(restEndpoint.http.STATUS_OK)
    .process(() => entries.map(e => ({ name: e.name, type: getType(e) })).filter(e => e.type !== commons.fileTypes.TYPE_OTHER))

var listDirectory = (contextFactory, path) => fs.promises.readdir(path, { withFileTypes: true })
  .then(entries => commons.try(() => processEntries(entries, contextFactory), e => Promise.reject('Cannot read dir: `' + path + '` - ' + e)))
  .catch(e => restEndpoint.tools.responseJsonError.serverError(contextFactory, JSON.stringify(e).substr(0, 255)))

var checkAllowed = commons.whenBuilder()
  .then(p => listDirectory(p.contextFactory, p.path))
  .otherwise(p => restEndpoint.tools.responseJsonError.forbidden(p.contextFactory, 'Directory listing is not allowed'))
  .build()

module.exports = (contextFactory, path, allowListing) => checkAllowed(allowListing, { contextFactory, path })
