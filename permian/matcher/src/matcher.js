var fluent = require('@permian/fluent')
var { isFunction, throwError } = fluent.util

var functionify = obj => isFunction(obj) ? obj : () => obj

var checkContext = ctx => !ctx.otherwise && ctx.ons.length === 0 && throwError('At least one  otherwise()  or  on()  must be declared.')

var val = v => ({ val: v })

var fetchAllResults = (ctx, arg) => ctx.ons.filter(on => on.o1(arg)).map(on => val(on.o2(arg)))

var fetchFirstHit = (ctx, arg) => {
  var found = ctx.ons.find(on => on.o1(arg))
  return found ? [val(found.o2(arg))] : []
}

var rules = {
  start: {
    handler: ctx => ctx.ons = [],
    transitions: ['on', 'otherwise', 'all'],
    startState: true
  },
  on: {
    handler: (ctx, on1, on2) => ctx.ons.push({
      o1: isFunction(on1) ? on1 : arg => arg === on1,
      o2: functionify(on2)
    }),
    transitions: ['on', 'build', 'otherwise']
  },
  all: {
    handler: ctx => ctx.all = true,
    transitions: ['on', 'otherwise']
  },
  otherwise: {
    handler: (ctx, otherwise) => ctx.otherwise = functionify(otherwise),
    transitions: ['build']
  },
  build: {
    handler: ctx => ctx.result = arg => {
      checkContext(ctx)
      var results = ctx.all ? fetchAllResults(ctx, arg) : fetchFirstHit(ctx, arg)
      results.length === 0 && results.push(ctx.otherwise ? val(ctx.otherwise(arg)) : val())
      return ctx.all ? results.map(r => r.val) : results[0].val
    }
  }
}

module.exports = fluent.buildFactory(rules).createInstance()