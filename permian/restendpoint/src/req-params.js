var url = require('url')
var commons = require('./commons')

var newInstance = (request, response, logger, pathPosition) => {
  var uid = commons.uuid()
  return {
    getUid: () => uid,
    getPathPosition: () => pathPosition,
    getLogger: () => logger,
    getRequestParameters: () => url.parse(request.url, true).query,
    getFullPath: () => url.parse(request.url).path.split('?')[0].replace(/\/+$/, '').split('/'),
    getActualPath: () => this.getFullPath().slice(0, pathPosition),
    getRemainingPath: () => this.getFullPath().slice(pathPosition + 1)
  }
}

module.exports = { newInstance }
