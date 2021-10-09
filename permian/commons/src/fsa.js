var _ = require('./lodash')

function Fsa(startState) {
  var currentState = startState

  this.getStateName = () => currentState.name

  this.delta = symbol => Promise.resolve(currentState.delta(symbol))
    .then(newState => {
      var result
      if(_.isFunction(newState?.delta)) { 
        currentState = newState 
        result = Promise.resolve()
      } else { 
        currentState = Fsa.createErrorState(`${currentState.name || currentState.constructor?.name || 'unknown state'} -> Error`)
        result = Promise.reject(Fsa.STATE_TRANSITION_ERROR)
      } 
      return result
    })
}

Fsa.STATE_TRANSITION_ERROR = 'State transition error'

Fsa.createErrorState = n => Object.freeze({ 
  delta: () => false,
  name: n || 'ERROR'
})

Fsa.createInstance = startState => new Fsa(startState)

module.exports = Object.freeze(Fsa)
