var { throwError } = require('./commons')
var http = require('./http')

function ResponseTypeSetter(processor) {
  var contentType = http.CONTENTTYPE_OCTET_STREAM
  var statusCode = http.STATUS_OK
  var contentEncoding

  this.setContentType = t => {
    t && (contentType = t)
    return this
  }

  this.setStatusCode = c => {
    c && (statusCode = c)
    return this
  }

  this.setEncoding = e => {
    contentEncoding = e
    return this
  }

  this.process = f => {
    this.process = () => throwError('process() cannot be invoked more than once')
    var ctx = {
      statusCode,
      contentType,
      processor: (request, response) => processor(request, response, f)
    }
    contentEncoding && (ctx.contentEncoding = contentEncoding)
    return ctx
  }
}

module.exports = ResponseTypeSetter
