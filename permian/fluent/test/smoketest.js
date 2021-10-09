/*
var matcher = buildFluentFactory(rules)

matcher()
  .value(1)
  .on()
  .end()

Start      ->  Matcher
Matcher    ->  Value | On | Predicate
On         ->  On | otherwise | end
Value      ->  On | Predicate
Predicate  ->  Value | On

*/

var assert = require('assert')
var fluent = require('../')

var rules01 = {
  matcher: {
    handler: ctx => {
      console.log('handle matcher()')
    },
    startState: true,
    transitions: ['value', 'on', 'predicate']
  },
  on: {
    handler: (ctx, a, b) => {
      console.log('handle on()', a, b, ctx)
    },
    transitions: ['end', 'on', 'otherwise']
  },
  value: {
    handler: (ctx, v) => {
      console.log('handle value()', v, ctx)
    },
    transitions: ['on', 'predicate']
  },
  predicate: {
    handler: (ctx, p) => {
      ctx.foo = 'FOO'	    
      console.log('handle predicate()')
    },
    transitions: ['value', 'on']
  },
  otherwise: {
    handler: (ctx, o) => {
      console.log('handle otherwise()')
    }
  },
  end: {
    handler: ctx => {
      console.log('handle end()')
      ctx.result = 7
    }
  }
}

var matcher = fluent.build(rules01, {ctxField: 1})

var result = matcher().value(9).predicate().on(1, 2).on().on().end()
assert.equal(result, 7)

console.log('\nOK')
