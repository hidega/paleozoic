var { throwError } = require('./commons')
var http = require('./http')

var newInstance = processor => {
  var contentType = http.CONTENTTYPE_OCTET_STREAM
  var statusCode = http.STATUS_OK
  var contentEncoding
  var responseTypeSetter = {
    setContentType: t => {
      t && (contentType = t)
      return responseTypeSetter
    }, setStatusCode: c => {
      c && (statusCode = c)
      return responseTypeSetter
    }, setEncoding: e => {
      contentEncoding = e
      return responseTypeSetter
    },
    process: f => {
      responseTypeSetter.process = () => throwError('process() cannot be invoked more than once')
      var ctx = {
        statusCode,
        contentType,
        processor: (request, response) => processor(request, response, f)
      }
      contentEncoding && (ctx.contentEncoding = contentEncoding)
      return ctx
    }
  }
  return Object.freeze(responseTypeSetter)
}

module.exports = { newInstance }
