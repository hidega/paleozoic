var prependPath = require('../src/prepend-path')
var findHandler = require('../src/find-handler')
var validateHandlers = require('../src/validate-handlers')
var assert = require('assert')

assert.deepEqual(prependPath([], { a: 1 }), { a: 1 })
assert.deepEqual(prependPath('', { a: 1 }), { a: 1 })
assert.deepEqual(prependPath('p', {}), {})
assert.deepEqual(prependPath(['p'], {}), {})
assert.deepEqual(prependPath('p1', { GET: { a: 'A' }}), { GET: { p1: { a: 'A' }}})
assert.deepEqual(prependPath('////p1//', { GET: { a: 'A' }}), { GET: { p1: { a: 'A' }}})
assert.deepEqual(prependPath(['p2'], { GET: { a: 'A' }}), { GET: { p2: { a: 'A' }}})

assert.deepEqual(prependPath('/p3a/p3b/', { GET: { a: 'A' }}), { GET: { p3a: { p3b: { a: 'A' }}}})
assert.deepEqual(prependPath(['p4a', 'p4b'], { GET: { a: 'A' }}), { GET: { p4a: { p4b: { a: 'A' }}}})

assert.deepEqual(prependPath(['p5a', 'p5b', 'p5c'], { 
  GET: { a: 'A' },
  PUT: { b: { c: 'C' }}
}),{ 
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
        p5c: { b: { c: 'C' }}
      }
    }
  } 
})

var noHandler = { handler: false }
var handler = () => {}
assert.deepEqual(findHandler({}, []), noHandler)
assert.deepEqual(findHandler({ f: () => {}}, []), noHandler)
assert.deepEqual(findHandler({ a: { f: () => {}}}, ['b']), noHandler)
assert.deepEqual(findHandler({ f: handler}, ['f']), { handler, pos: 0 })
assert.deepEqual(findHandler({ a: { e:1, f: handler}}, ['a', 'f']), { handler, pos: 1 })

assert.throws(() => validateHandlers())
assert.throws(() => validateHandlers(null))
assert.throws(() => validateHandlers({}))
assert.throws(() => validateHandlers({ POST: { a: () => {}}, FOO: { b: () => {}}}))
assert.throws(() => validateHandlers({ POST: () => {}}))

var handlers1 = { POST: { foo: () => {}}, GET: { bar: () => {}}}
assert.deepEqual(validateHandlers(handlers1), handlers1)


console.log('OK')
