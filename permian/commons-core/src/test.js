var http = require('http')

var TIMEOUT_MS = 5000

var testServerHandlerTemplate = msg => (req, res) => {
  res.writeHead(200);
  res.end('{"message":"' + msg + '"}');
}

var parseTestServerParams = p => Object.assign({
  port: 18080,
  host: '127.0.0.1',
  onGet: testServerHandlerTemplate('GET handler OK'),
  onPut: testServerHandlerTemplate('PUT handler OK'),
  onDelete: testServerHandlerTemplate('DELETE handler OK'),
  onPost: testServerHandlerTemplate('POST handler OK')
}, p)

var dispatchRequest = (req, res, params) => {
  if (request.method === 'GET') {
    params.onGet(req, res)
  } else if (request.method === 'PUT') {
    params.onPut(req, res)
  } else if (request.method === 'DELETE') {
    params.onDelete(req, res)
  } else if (request.method === 'POST') {
    params.onPost(req, res)
  } else {
    res.writeHead(200)
    res.end('{"message":"Unsupported method: ' + request.method + '"}')
  }
}

module.exports = {
  startServer: p => {
    var params = parseTestServerParams(p)
    var requestListener = (req, res) => dispatchRequest(req, res, params)
    var server = http.createServer(requestListener)
    server.setTimeout(TIMEOUT_MS)
    server.listen(params.port, params.host);
    return {
      params: Object.assign({}, params),
      stop: () => {
        server.close
        server = false
      }
    }
  }
}