var fluent = require('./fluent')
var _ = require('./lodash')

var isSymbol = o => typeof o === 'symbol'

var boolEvaluate = obj => {
  var boolEvaluation = obj
  if (obj === true || _.isString(obj) || _.isArray(obj) || isSymbol(obj) || _.isObject(obj) || _.isNumber(obj) || _.isFunction(obj)) {
    boolEvaluation = true
  } else if (obj === false) {
    boolEvaluation = false
  } else {
    boolEvaluation = !!obj
  }
  return boolEvaluation
}

var build = {
  handler: ctx => ctx.result = (arg, k) => {
    var result
    if (_.isNil(arg) && ctx.onNil) {
      result = ctx.onNil(k)
    } else if (boolEvaluate(arg) && ctx.onTrue) {
      result = ctx.onTrue(k)
    } else {
      result = ctx.otherwise(k)
    }
    return result
  }
}

var functionify = obj => _.isFunction(obj) ? obj : () => obj

var rules = {
  build,
  isNil: {
    handler: (ctx, onNil) => ctx.onNil = functionify(onNil),
    transitions: ['then', 'otherwise', 'build']
  },
  then: {
    handler: (ctx, onTrue) => ctx.onTrue = functionify(onTrue),
    transitions: ['otherwise', 'build']
  },
  otherwise: {
    handler: (ctx, otherwise) => ctx.otherwise = functionify(otherwise),
    transitions: ['build']
  },
  start: {
    handler: ctx => ctx.otherwise = () => undefined,
    transitions: ['isNil', 'then', 'otherwise', 'build'],
    startState: true
  }
}

module.exports = fluent.buildFactory(rules).createInstance()
