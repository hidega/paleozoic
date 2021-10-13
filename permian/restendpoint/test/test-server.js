var fs = require('fs')
var assert = require('assert')
var { Readable } = require('stream')
var restendpoint = require('../src')
var commons = require('../src/commons')

var HELLO_WORLD = 'Hello World!'

var server = restendpoint.startInstance({
  GET: {
    'favicon.ico': (parameters, contextFactory) => contextFactory.emptyToBuffer()
      .setContentType(restendpoint.http.CONTENTTYPE_OCTET_STREAM)
      .setStatusCode(restendpoint.http.STATUS_OK)
      .process(() => Buffer.from([])),
    'say-hello': {
      'nil-ctx': () => { },
      'throw-exception': (parameters, contextFactory) => contextFactory.default().process((request, response) => commons.throwError('Execption!')),
      'default-ctx': (parameters, contextFactory) => contextFactory.default().process((request, response) => response.end(HELLO_WORLD)),
      'buffer-to-stream': (parameters, contextFactory) => {
        return contextFactory.bufferToStream()
          .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
          .setStatusCode(restendpoint.http.STATUS_OK)
          .process((payload, outstream) => outstream.end(HELLO_WORLD))
      },
      'buffer-piped-to-stream': (parameters, contextFactory) => contextFactory.emptyToStream()
        .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
        .setStatusCode(restendpoint.http.STATUS_OK)
        .process((outstream) => Readable.from(HELLO_WORLD).pipe(outstream)),
      'object-to-stream': (parameters, contextFactory) => {
        return contextFactory.objectToStream()
          .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
          .setStatusCode(restendpoint.http.STATUS_OK)
          .process((payload, outstream) => outstream.end(HELLO_WORLD))
      },
      'empty-to-stream': (parameters, contextFactory) => Promise.resolve(contextFactory.emptyToStream()
        .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
        .setStatusCode(restendpoint.http.STATUS_OK)
        .process(outstream => outstream.end(HELLO_WORLD))),
      'file-to-stream': (parameters, contextFactory) => contextFactory.emptyToStream()
        .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
        .setStatusCode(restendpoint.http.STATUS_OK)
        .process(outstream => fs.createReadStream(commons.resolvePath(__dirname, 'testdata_1M.txt1')).pipe(outstream)),
      'empty-to-buffer': (parameters, contextFactory) => contextFactory.emptyToBuffer()
        .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
        .setStatusCode(restendpoint.http.STATUS_OK)
        .process(() => Promise.resolve(HELLO_WORLD)),
      'object-to-buffer': (parameters, contextFactory) => {
        return contextFactory.objectToBuffer()
          .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
          .setStatusCode(restendpoint.http.STATUS_OK)
          .process(payload => HELLO_WORLD)
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
          .process(instream => Promise.resolve(HELLO_WORLD))
      },
      'json-err-badrequest': (parameters, contextFactory) => restendpoint.tools.responseJsonError.badRequest(contextFactory, 'bad request message'),
      'json-err-servererror': (parameters, contextFactory) => restendpoint.tools.responseJsonError.serverError(contextFactory),
      'json-err-notfound': (parameters, contextFactory) => restendpoint.tools.responseJsonError.notFound(contextFactory, 'not found message'),
      'json-err-forbidden': (parameters, contextFactory) => restendpoint.tools.responseJsonError.forbidden(contextFactory),
      'json-obj-ok': (parameters, contextFactory) => restendpoint.tools.responseJsonOk(contextFactory),
      'json-obj-notok': (parameters, contextFactory) => restendpoint.tools.responseJsonNotOk(contextFactory),
      'json-obj-noparam': (parameters, contextFactory) => restendpoint.tools.responseJsonObject(contextFactory),
      'json-obj-str': (parameters, contextFactory) => restendpoint.tools.responseJsonObject(contextFactory, HELLO_WORLD),
      'json-obj-object': (parameters, contextFactory) => restendpoint.tools.responseJsonObject(contextFactory, restendpoint.http.STATUS_OK, { s: 'Some string' })
    }
  },
  POST: {
    'say-hello': {
      'nil-ctx': () => { },
      'default-ctx': (parameters, contextFactory) => {
        return contextFactory.default()
          .process((request, response) => response.end(HELLO_WORLD))
      },
      'buffer-to-stream': (parameters, contextFactory) => {
        return contextFactory.bufferToStream()
          .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
          .setStatusCode(restendpoint.http.STATUS_OK)
          .process((payload, outstream) => outstream.end(HELLO_WORLD + payload))
      },
      'object-to-stream': (parameters, contextFactory) => {
        return contextFactory.objectToStream()
          .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
          .setStatusCode(restendpoint.http.STATUS_OK)
          .process((payload, outstream) => outstream.end(HELLO_WORLD + JSON.stringify(payload)))
      },
      'object-to-buffer': (parameters, contextFactory) => {
        return contextFactory.objectToBuffer()
          .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
          .setStatusCode(restendpoint.http.STATUS_OK)
          .process(payload => Promise.resolve(HELLO_WORLD + JSON.stringify(payload)))
      },
      'buffer-to-buffer': (parameters, contextFactory) => {
        return contextFactory.bufferToBuffer()
          .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
          .setStatusCode(restendpoint.http.STATUS_OK)
          .process(payload => Promise.resolve(HELLO_WORLD + payload))
      },
      'stream-to-buffer': (parameters, contextFactory) => {
        return contextFactory.streamToBuffer()
          .setContentType(restendpoint.http.CONTENTTYPE_TEXT)
          .setStatusCode(restendpoint.http.STATUS_OK)
          .process(instream => commons.readStreamToBuffer(instream, 100000).then(buffer => HELLO_WORLD + buffer))
      }
    }
  },
  PUT: {},
  DELETE: {}
}, {
  id: 'test',
  logToStdout: true
})

var baseUrl = 'http://localhost:22333/say-hello/'

setTimeout(() => {}, 500)

var assertBufferEquals = (buf, exp) => assert.equal(buf.toString(), exp)

commons.httpGet(baseUrl + 'default-ctx')
  .then(buf => assertBufferEquals(buf, HELLO_WORLD))
  .then(() => commons.httpGet(baseUrl + 'buffer-to-stream'))
  .then(buf => assertBufferEquals(buf, HELLO_WORLD))
  .then(() => commons.httpGet(baseUrl + 'stream-to-buffer'))
  .then(buf => assertBufferEquals(buf, HELLO_WORLD))
  .then(() => commons.httpPost(baseUrl + 'default-ctx'))
  .then(buf => assertBufferEquals(buf, HELLO_WORLD))
  .then(() => console.log('\nTest is OK\n'))
  .catch(e => {
    console.log('\nERROR: ' + e)
    assert.fail()
  })
  .finally(server.stop)

// http://localhost:22333/say-hello/buffer-to-buffer
// 
// curl -X POST -d '{"name": "linuxize", "email": "linuxize@example.com"}' http://localhost:22333/say-hello/stream-to-buffer
