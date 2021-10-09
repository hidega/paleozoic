var url = require('url')
var commons = require('./commons')

function RequestParameters(request, response, logger, pathPosition) {
  var uid = commons.uuid()

  this.getUid = () => uid

  this.getPathPosition = () => pathPosition

  this.getLogger = () => logger

  this.getRequestParameters = () => url.parse(request.url, true).query

  this.getFullPath = () => url.parse(request.url).path.split('?')[0].replace(/\/+$/, '').split('/')

  this.getActualPath = () => this.getFullPath().slice(0, pathPosition)

  this.getRemainingPath = () => this.getFullPath().slice(pathPosition + 1)
}

module.exports = RequestParameters
