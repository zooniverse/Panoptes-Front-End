module.exports =
  getInitialState: ->
    awaiting: []

  componentWillMount: ->
    @_statePromises = {}

  promiseToSetState: (keysAndPromises, callback) ->
    for key, promise of keysAndPromises
      promiseHandler = @_handlePromisedState.bind this, key, promise
      promise.then promiseHandler.bind this, false
      promise.catch promiseHandler.bind this, true
      @_statePromises[key] = promise

    {awaiting} = @state
    if key in awaiting
      callback?()
    else
      awaiting.push key
      @setState {awaiting}, callback

  _handlePromisedState: (key, promise, caught, value) ->
    # Only change the state if its current value is the same promise that's resolving.
    samePromise = @_statePromises[key] is promise
    delete @_statePromises[key]

    if @isMounted() and samePromise
      newState = {}

      if caught and value not instanceof Error
        error = new Error value
        error.message = value # Override string-only messages. Maybe this isn't a great idea.
        value = error

      newState[key] = value

      {awaiting} = @state
      awaiting.splice awaiting.indexOf(key), 1
      newState.awaiting = awaiting

      @setState newState
