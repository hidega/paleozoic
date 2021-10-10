var fluent = require('@permian/fluent')
var { isSymbol, isString, isObject, isNumber, isArray, isFunction } = fluent.util

var boolEvaluate = obj => {
  var boolEvaluation = obj
  if (obj === true || isString(obj) || isArray(obj) || isSymbol(obj) || isObject(obj) || isNumber(obj) || isFunction(obj)) {
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
    if (fluent.util.isNil(arg) && ctx.onNil) {
      result = ctx.onNil(arg, k)
    } else if (boolEvaluate(arg) && ctx.onTrue) {
      result = ctx.onTrue(arg, k)
    } else {
      result = ctx.otherwise(arg, k)
    }
    return result
  }
}

var functionify = obj => isFunction(obj) ? obj : () => obj

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