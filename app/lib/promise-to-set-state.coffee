module.exports =
  getInitialState: ->
    pending: {}
    rejected: {}

  promiseToSetState: (keysAndPromises, callback) ->
    {pending, rejected} = @state

    for key, promise of keysAndPromises
      promiseHandler = @_handlePromisedState.bind this, key, promise
      promise.then promiseHandler.bind this, false
      promise.catch promiseHandler.bind this, true

      pending[key] = promise
      delete rejected[key]

    @setState {pending, rejected}, callback

  _handlePromisedState: (key, promise, caught, value) ->
    # Only change the state if its current value is the same promise that's resolving.
    isThePromiseInState = promise is @state.pending[key]

    if @isMounted() and isThePromiseInState
      {pending, rejected} = @state
      newState = {pending, rejected}

      delete pending[key]

      if caught
        newState[key] = null
        rejected[key] = value
      else
        newState[key] = value
        delete rejected[key]

      @setState newState

    null
