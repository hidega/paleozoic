var fs = require('fs')
var restendpoint = require('../src')
var commons = require('../src/commons')
var { Readable } = require('stream')

var caseServer = () => {
  restendpoint.startInstance({
    GET: {
      'favicon.ico': (parameters, contextFactory) => contextFactory.emptyToBuffer()
        .setContentType(restendpoint.http.CONTENTTYPE_OCTET_STREAM)
        .setStatusCode(restendpoint.http.STATUS_OK)
        .process(() => Buffer.from([])),
      'say-hello': {
	      'nil-ctx': () => {},
        'default-ctx': (parameters, contextFactory) => {
          return contextFactory.default() 
            .process((request, response) => response.end('Hello world!'))  
        },
        'buffer-to-stream': (parameters, contextFactory) => {
          return contextFactory.bufferToStream() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process((payload, outstream) => outstream.end('Hello world!'))
        },
        'buffer-piped-to-stream': (parameters, contextFactory) => contextFactory.emptyToStream() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process((outstream) => Readable.from('Hello world!').pipe(outstream)),
        'object-to-stream': (parameters, contextFactory) => {
          return contextFactory.objectToStream() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process((payload, outstream) => outstream.end('Hello world!'))
        },
        'empty-to-stream': (parameters, contextFactory) => Promise.resolve(contextFactory.emptyToStream() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process(outstream => outstream.end('Hello world!'))),
        'file-to-stream': (parameters, contextFactory) => contextFactory.emptyToStream() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process(outstream => fs.createReadStream(commons.resolvePath(__dirname, 'testdata_1M.txt1')).pipe(outstream)),
        'empty-to-buffer': (parameters, contextFactory) => contextFactory.emptyToBuffer() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process(() => Promise.resolve('Hello World')),
        'object-to-buffer': (parameters, contextFactory) => {
          return contextFactory.objectToBuffer() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process(payload => 'Hello World')
        },
        'buffer-to-buffer': (parameters, contextFactory) => {
          return contextFactory.bufferToBuffer()  
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process(payload => ({ a: 1, b: 2 }))
        },
        'stream-to-buffer': (parameters, contextFactory) => {
          return contextFactory.streamToBuffer() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process(instream => Promise.resolve('Hello World'))
        },
        'json-err-badrequest': (parameters, contextFactory) => restendpoint.tools.responseJsonError.badRequest(contextFactory, 'bad request message'),
        'json-err-servererror': (parameters, contextFactory) => restendpoint.tools.responseJsonError.serverError(contextFactory),
        'json-err-notfound': (parameters, contextFactory) => restendpoint.tools.responseJsonError.notFound(contextFactory, 'not found message'),
        'json-err-forbidden': (parameters, contextFactory) => restendpoint.tools.responseJsonError.forbidden(contextFactory),
        'json-obj-ok': (parameters, contextFactory) => restendpoint.tools.responseJsonOk(contextFactory),
        'json-obj-notok': (parameters, contextFactory) => restendpoint.tools.responseJsonNotOk(contextFactory),
        'json-obj-noparam': (parameters, contextFactory) => restendpoint.tools.responseJsonObject(contextFactory),
        'json-obj-str': (parameters, contextFactory) => restendpoint.tools.responseJsonObject(contextFactory, 'Some string'),
        'json-obj-object': (parameters, contextFactory) => restendpoint.tools.responseJsonObject(contextFactory, restendpoint.http.STATUS_OK, { s: 'Some string' })
      }
    },
    POST: {
      'say-hello': {
	      'nil-ctx': () => {},
        'default-ctx': (parameters, contextFactory) => {
          return contextFactory.default() 
            .process((request, response) => response.end('Hello world! '))  
        },
        'buffer-to-stream': (parameters, contextFactory) => {
          return contextFactory.bufferToStream() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process((payload, outstream) => outstream.end('Hello world! ' + payload))
        },
        'object-to-stream': (parameters, contextFactory) => {
          return contextFactory.objectToStream() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process((payload, outstream) => outstream.end('Hello world! ' + JSON.stringify(payload)))
        },
        'object-to-buffer': (parameters, contextFactory) => {
          return contextFactory.objectToBuffer() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process(payload => Promise.resolve('Hello World ' + JSON.stringify(payload)))
        },
        'buffer-to-buffer': (parameters, contextFactory) => {
          return contextFactory.bufferToBuffer()  
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process(payload => Promise.resolve('Hello World ' + payload))
        },
        'stream-to-buffer': (parameters, contextFactory) => {
          return contextFactory.streamToBuffer() 
            .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
            .setStatusCode(restendpoint.http.STATUS_OK)
            .process(instream => commons.readStreamToBuffer(instream, 100000).then(buffer => 'Hello World ' + buffer))
        }
      }
    },
    PUT: {},
    DELETE: {}
  }, { 
    id: 'test',
    logToStdout: true
  })
}
 
caseServer()

// http://localhost:22333/say-hello/buffer-to-buffer
// 
// curl -X POST -d '{"name": "linuxize", "email": "linuxize@example.com"}' http://localhost:22333/say-hello/stream-to-buffer

