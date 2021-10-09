var http = require('http')

var cmd = process.argv[1]

if (contract.START_CMD === cmd) {
  // if DEVONIAN_MAGIC_INFO is 'unhealthy' then do not start server
  var server = http.createServer((req, res) => { 
    res.write('<h1><p>Hello world!</p>')
    res.write(`<p>${req.url}<br/>${new Date()}</p></h1>`)
    res.end()
  }).listen(12345, '127.0.0.1') 
  server.setTimeout(2000)
} else if (contract.HEALTHCHECK_CMD === cmd) {
  process.exit(0)
} else {
  console.error('unknown command: ' + cmd)
  process.exit(2)
}

