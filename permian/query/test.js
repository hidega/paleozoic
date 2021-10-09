var query = require('.')
const http = require('http')

var PORT = 18030
var LOCAL_IP = '127.0.0.1'
var HTTP_URL = `http:${LOCAL_IP}:${PORT}`
var HTTPS_URL = 'https://www.index.hu'

var server = http.createServer((req, res) => { 
  res.write('<h1><p>Hello world!</p>')
  res.write(`<p>${req.url}<br/>${new Date()}</p></h1>`)
  res.end()
}).listen(PORT, LOCAL_IP) 

server.setTimeout(2000)

setTimeout(() => server.close(), 5000)

var caseHttpGet = () => query.http.get(HTTP_URL)

var caseHttpsGet = () => query.https.get(HTTPS_URL)

caseHttpGet()
  .then(() => caseHttpsGet())
  .then(() => console.log('OK'))
  .catch(e => console.log('ERROR:\n', e))
