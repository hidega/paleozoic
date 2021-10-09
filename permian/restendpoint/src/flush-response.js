var commons = require('./commons')
var http = require('./http')

module.exports = (response, summary) => {
  summary.dateTime = commons.isoDateNow()
  response.writeHead(summary.httpStatusCode || 400, { 'Content-Type': http.CONTENTTYPE_JSON })
  response.write(JSON.stringify(summary))
  response.end()
}
