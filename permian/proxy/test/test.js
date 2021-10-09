const http = require('http')
const https = require('https')
const ws = require('@permian/websocket')
const proxy = require('..')
const config = require('./config.json')

config.logger = console.log
config.requestMarker = () => 'Test'

var caseProxy = () => {
  ws.Server.start({ // port: 37590
    logger: { 
      info: console.log, 
      error: console.error 
    },
    handlers: {
      onConnection: (ws, req) => {
        console.log('Connection |', ws)
        ws.send('downward message')
      },
      onMessage: (ws, msg) => {
        console.log('Message |', ws, msg)
      },
      onClose: (ws, code) => {
        console.log('Close |', ws, code)
      },
      onOpen: ws => {
        console.log('Open |', ws)
      },
      onError: (ws, err) => {
        console.log('Error |', ws, err)
      }
    }
  })

  http.createServer((req, res) => { 
    res.write('<h1><p>Hello world!</p>')
    res.write(`<p>${req.url}<br/>${new Date()}</p></h1>`)
    res.end()
  }).listen(8010) 

  http.createServer((req, res) => { 
    res.setHeader('content-type', 'image/png')
    res.write('data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAC/v78AWFhYAElJSQA6OjoAKysrABwcHAC9vb0AVlZWACkpKQCBgYEAGhoaAAsLCwCsrKwARUVFADY2NgD19fUAJycnAH9/fwAYGBgAcHBwAAkJCQBhYWEAubm5AFJSUgDz8/MANDQ0ACUlJQB9fX0AFhYWAG5ubgAHBwcAX19fALe3twBQUFAAQUFBACMjIwAUFBQAXV1dAE5OTgCmpqYAPz8/AP7+/gAwMDAAISEhABISEgBqamoAW1tbAExMTAA9PT0ALi4uAB8fHwDe3t4Ad3d')
    res.end()
  }).listen(8020) 

  http.createServer((req, res) => { 
    res.write('<h1><p>Hello alternative world!</p>')
    res.write(`<p>${req.url}<br/>${new Date()}</p></h1>`)
    res.end()
  }).listen(8030) 

  http.createServer((req, res) => { 
    res.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          
          <title>Websocket test</title>
                
          <script>
            (function() {
              function WebsocketClient(url, h) {
                var self = this;

                var handlers = {
                  close: h.close || function() {},
                  error: h.error || function() {},
                  message: h.message || function() {},
                  open: h.open || function() {}
                };

                var socket = new WebSocket(url);

                socket.onerror = handlers.error;
                socket.onclose = function(event) { handlers.close(event.code, event); };
                socket.onmessage = function(event) { handlers.message(event.data, event); };
                socket.onopen = handlers.open;

                WebSocket.binaryType = 'blob';

                self.startDate = Object.freeze(Date.now());

                self.send = function(data) { socket.send(data); };

                self.dispose = function() {
                  socket.close();
                  self.send = function() {};
                  self.dispose = function() {};
                };

                self.getBufferedAmount = function() { return socket.bufferedAmount; };

                self.getConnectionState = function() { return socket.readyState; };
              }

              if(!window.permian) {
                window.permian = {};
              }

              window.permian.WebsocketClient = WebsocketClient;
            })();
          </script>   

          <script>
            console.log('ws url', 'wss://127.0.0.1:9000/ws')
            var websocketClient = new permian.WebsocketClient('wss://127.0.0.1:9000/ws', {
              error: function(event) { console.error('ERROR', event); },
              close: function(code, event) { console.log('CLOSE', code, event); },
              message: function(data, event) { console.log('MESSAGE', data, event); },
              open: function(event) { 
                console.log('OPEN', event);
                websocketClient.send('upward message'); 
              }
            });
          </script>     
        </head>
       
        <body>
          <div></div>
        </body>
      </html>
    `)
    res.end()
  }).listen(8040) 
  proxy.startInstance(config)
}

caseProxy()
