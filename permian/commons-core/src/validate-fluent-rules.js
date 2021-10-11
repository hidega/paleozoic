var { throwError, isFunction, isBoolean, isArray, isObject, isString } = require('./lodash')

var wrapChecker = (field, f) => field ? f() : {}

var checkHandler = (handler, rule) => wrapChecker(handler, () => isFunction(handler) ? result = { handler } : throwError('Bad handler in rule ' + rule))

var checkStartState = (startState, rule) => wrapChecker(startState, () => isBoolean(startState) ? { startState } : throwError('Bad startState in rule ' + rule))

var checkTransitions = (transitions, rule) => wrapChecker(transitions, () => {
  isArray(transitions) || throwError('Bad transitions in rule ' + rule)
  transitions.forEach(t => isString(t) || throwError('Non string transition in rule ' + rule))
  return ({ transitions })
})

var checkAndCopyRuleBody = (r, body, rule = `"${r}"`) => {
  isObject(body) || throwError('Rule is not an object: ' + rule)
  var copy = Object.assign({}, checkHandler(body.handler, rule), checkStartState(body.startState, rule), checkTransitions(body.transitions, rule))
  Object.keys(body).length !== Object.keys(copy).length && throwError('Bad entry in rule ' + rule)
  return copy
}

var checkRule = (acc, entry) => {
  var rule = entry[0]
  var bodyCopy = checkAndCopyRuleBody(rule, entry[1])
  acc[rule] = bodyCopy
  return acc
}

var checkSingleStartState = rules => {
  var startStateCount = Object.values(rules).reduce((acc, e) => acc + (!!e.startState), 0)
  startStateCount === 1 || throwError('Missing or multiple start states.')
}

var checkStateTransitions = (alloweds, tr, rule) => tr.forEach(tr => alloweds.includes(tr) || throwError('Invalid transition(s) in rule ' + rule))

var checkStateTransitions = rules => {
  var transitions = Object.keys(rules)
  Object.entries(rules).forEach(e => e[1].transitions ? checkStateTransitions(transitions, e[1].transitions, e[0]) : e[1].isTerminal = true)
}

module.exports = r => {
  isObject(r) || throwError('Rule set is not an object.')
  var rules = Object.entries(r).reduce(checkRule, {})
  checkSingleStartState(rules)
  checkStateTransitions(rules)
  return rules
}
