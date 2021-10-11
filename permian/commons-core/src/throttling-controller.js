var createStates = (action, maxWaitingTimeMs, getState, setState) => {
  var toHandle = false
  var wasRequest = false
  var states = {
    idle: {
      request: () => {
        clearTimeout(toHandle)
        toHandle = setTimeout(() => getState().timeout(), maxWaitingTimeMs)
      },
      requestCompleted: () => { },
      timeout: () => {
        setState(states.processing)
        setImmediate(action)
      }
    },
    processing: {
      request: () => wasRequest = true,
      requestCompleted: () => {
        if (wasRequest) {
          wasRequest = false
          setImmediate(action)
        } else {
          setState(states.idle)
        }
      }
    },
    halt: {}
  }
  return states
}

var createThrottlingController = (action, mwt) => {
  var maxWaitingTimeMs = mwt || 1000
  var state = false
  var states = createStates(action, maxWaitingTimeMs, () => state, s => state = s)
  state = states.idle

  var throttlingController = {
    notifyRequest: () => state.request(),
    notifyRequestCompleted: () => state.requestCompleted()
  }

  throttlingController.dispose = () => {
    state = states.halt
    throttlingController.notifyRequest = () => { }
    throttlingController.notifyRequestCompleted = () => { }
  }

  return throttlingController
}

module.exports = {
  newInstance: (action, mwt) => createThrottlingController(action, mwt)
}
