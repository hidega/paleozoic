var validateRules = require('./validate-fluent-rules')

var buildFactory = rules => {
  var rules = validateRules(rules)
  var startState = Object.keys(rules).find(k => rules[k].startState)

  var createState = (name, ctx) => rules[name].transitions?.reduce((acc, n) => {
    acc[n] = (...args) => {
      rules[n].handler && rules[n].handler(ctx, ...args)
      return createState(n, ctx) || ctx.result
    }
    return acc
  }, {})

  return {
    createInstance: () => (...args) => {
      var ctx = {}
      rules[startState].handler && rules[startState].handler(ctx, ...args)
      return createState(startState, ctx)
    }
  }
}

module.exports = {
  buildFactory,
  build: rules => buildFactory(rules).createInstance()
}
