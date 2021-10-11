function ThrottlingController(action, mwt) {
  var maxWaitingTimeMs = mwt || 1000

  var toHandle = false
  var state = false
  var wasRequest = false

  var states = {
    idle: {
      request: () => {
        clearTimeout(toHandle)
        toHandle = setTimeout(() => state.timeout(), maxWaitingTimeMs)
      },
      requestCompleted: () => { },
      timeout: () => {
        state = states.processing
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
          state = states.idle
        }
      }
    },
    halt: {}
  }

  state = states.idle

  this.notifyRequest = () => state.request()

  this.notifyRequestCompleted = () => state.requestCompleted()

  this.dispose = () => {
    state = states.halt
    this.notifyRequest = () => { }
    this.notifyRequestCompleted = () => { }
  }
}

module.exports = ThrottlingController
