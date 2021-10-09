var validateRules = require('./validate-rules')
var commons = require('./commons')

function Factory(rules) {
  var startState = Object.keys(rules).find(k => rules[k].startState)

  var createState = (name, ctx) => rules[name].transitions?.reduce((acc, n) => {
    acc[n] = (...args) => {
      rules[n].handler && rules[n].handler(ctx, ...args)
      return createState(n, ctx) || ctx.result
    }
    return acc
  }, {})

  this.createInstance = () => (...args) => {
    var ctx = {}
    rules[startState].handler && rules[startState].handler(ctx, ...args)
    return createState(startState, ctx)
  }
}

var buildFactory = r => new Factory(validateRules(r))

module.exports = {
  util: commons,
  Factory,
  buildFactory,
  build: rules => buildFactory(rules).createInstance()
}