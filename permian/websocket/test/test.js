var assert = require('assert')
var ws = require('..')

var caseSimple = () => {
  ws.Server.start({
    logger: {
      info: m => console.log('INFO: ' + new Date().toISOString() + ' - ', m),
      error: m => console.error('ERROR: ' + new Date().toISOString() + ' - ', m)
    },
    handlers: {
      onConnection: (ws, req) => {
        console.log('_ Connection |', ws)
        ws.send('downward message')
      },
      onMessage: (ws, msg) => {
        console.log('_ Message |', ws, msg)
      },
      onClose: (ws, code) => {
        console.log('_ Close |', ws, code)
      },
      onOpen: ws => {
        console.log('_ Open |', ws)
      },
      onError: (ws, err) => {
        console.log('_ Error |', ws, err)
      }
    }
  })
 
  setInterval(() => ws.healthcheck('ws://127.0.0.1:37590', err => {
    if(err) {
      console.log('ERROR: ', err)
      assert(!err)
    }
    console.log('\n(Server is alive)\n')
  }), 5000)
}

caseSimple()
