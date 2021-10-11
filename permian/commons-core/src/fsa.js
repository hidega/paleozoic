var _ = require('./lodash')

var STATE_TRANSITION_ERROR = 'State transition error'

var createErrorState = n => Object.freeze({
  delta: () => false,
  name: n || 'ERROR'
})

var createInstance = startState => {
  var currentState = startState
  return {
    getStateName: () => currentState.name,
    delta: symbol => Promise.resolve(currentState.delta(symbol))
      .then(newState => {
        var result
        if (_.isFunction(newState?.delta)) {
          currentState = newState
          result = Promise.resolve()
        } else {
          currentState = createErrorState(`${currentState.name || currentState.constructor?.name || 'unknown state'} -> Error`)
          result = Promise.reject(STATE_TRANSITION_ERROR)
        }
        return result
      })
  }
}

module.exports = {
  createErrorState,
  STATE_TRANSITION_ERROR,
  createInstance
}
