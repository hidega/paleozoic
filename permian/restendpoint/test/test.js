var prependPath = require('../src/prepend-path')
var findHandler = require('../src/find-handler')
var httpConstants = require('../src/http')
var commons = require('../src/commons')
var tools = require('../src/tools')
var validateHandlers = require('../src/validate-handlers')
var parseCfg = require('../src/parse-cfg')
var startInstance = require('../src/start-instance')
var assert = require('assert')

var casePrependPath = () => {
  assert.deepEqual(prependPath([], { a: 1 }), { a: 1 })
  assert.deepEqual(prependPath('', { a: 1 }), { a: 1 })
  assert.deepEqual(prependPath('p', {}), {})
  assert.deepEqual(prependPath(['p'], {}), {})
  assert.deepEqual(prependPath('p1', { GET: { a: 'A' } }), { GET: { p1: { a: 'A' } } })
  assert.deepEqual(prependPath('////p1//', { GET: { a: 'A' } }), { GET: { p1: { a: 'A' } } })
  assert.deepEqual(prependPath(['p2'], { GET: { a: 'A' } }), { GET: { p2: { a: 'A' } } })

  assert.deepEqual(prependPath('/p3a/p3b/', { GET: { a: 'A' } }), { GET: { p3a: { p3b: { a: 'A' } } } })
  assert.deepEqual(prependPath(['p4a', 'p4b'], { GET: { a: 'A' } }), { GET: { p4a: { p4b: { a: 'A' } } } })

  assert.deepEqual(prependPath(['p5a', 'p5b', 'p5c'], {
    GET: { a: 'A' },
    PUT: { b: { c: 'C' } }
  }), {
    GET: {
      p5a: {
        p5b: {
          p5c: { a: 'A' }
        }
      }
    },
    PUT: {
      p5a: {
        p5b: {
          p5c: { b: { c: 'C' } }
        }
      }
    }
  })
}

var caseFindHandlers = () => {
  var noHandler = { handler: false }
  var handler = () => { }
  assert.deepEqual(findHandler({}, []), noHandler)
  assert.deepEqual(findHandler({ f: () => { } }, []), noHandler)
  assert.deepEqual(findHandler({ a: { f: () => { } } }, ['b']), noHandler)
  assert.deepEqual(findHandler({ f: handler }, ['f']), { handler, pos: 0 })
  assert.deepEqual(findHandler({ a: { e: 1, f: handler } }, ['a', 'f']), { handler, pos: 1 })
}

var caseValidateHandlers = () => {
  assert.throws(() => validateHandlers())
  assert.throws(() => validateHandlers(null))
  assert.throws(() => validateHandlers({}))
  assert.throws(() => validateHandlers({ POST: { a: () => { } }, FOO: { b: () => { } } }))
  assert.throws(() => validateHandlers({ POST: () => { } }))
  var handlers1 = { POST: { foo: () => { } }, GET: { bar: () => { } } }
  assert.deepEqual(validateHandlers(handlers1), handlers1)
}

var caseParseCfg = () => {
  parseCfg()
  assert.throws(() => parseCfg({ x: 1 }))
}

var caseServerStart = callback => {
  var handlers = {
    GET: {
      foo: (parameters, contextFactory) => contextFactory.bufferToStream()
        .setContentType(httpConstants.CONTENTTYPE_TEXT)
        .setStatusCode(httpConstants.STATUS_OK)
        .process((payload, outstream) => outstream.end('Hello world!' + payload))
    }
  }

  var server = startInstance(handlers, {
    requestTimeoutMs: 1000
  })

  var baseUrl = 'http:/' + server.configuration.host + ':' + server.configuration.port + '/'

  var invokeFoo = callback => commons.httpGet(baseUrl + 'foo', (err, response) => {
    server.stop()
    assert.equal(response.toString(), 'Hello world!')
    callback(err)
  })

  setTimeout(() => tools.pingHttpServer(baseUrl + httpConstants.PING_PATH, err => err ? callback(err) : invokeFoo(callback)), 1000)
}

casePrependPath()
caseValidateHandlers()
caseFindHandlers()
caseParseCfg()

caseServerStart(err => err ? console.log('\nERROR: ' + err) || assert.fail() : console.log('\nOK'))
