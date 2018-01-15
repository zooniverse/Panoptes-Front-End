###
  This is for when you want to set state after a promise has resolved.
  It handles pending state and errors automatically.

  createReactClass
    mixins: [PromiseToSetState]

    componentDidMount: ->
      @promiseToSetState foo: makeSomeRequest()

    render: ->
      if @state.foo?
        <span>Foo is {@state.foo}.</span>
      else if @state.rejected.foo?
        <span>{@state.rejected.foo.toString()}</span>
      else
        <span>Waiting for foo...</span>
###

module.exports =
  getInitialState: ->
    pending: {}
    rejected: {}

  componentWillMount: ->
    @_promiseStateKeys = {}

  promiseToSetState: (keysAndPromises, callback) ->
    {pending, rejected} = @state

    for key, promise of keysAndPromises
      @_promiseStateKeys[key] = promise

      promiseHandler = @_handlePromisedState.bind this, key, promise
      handledPromise = promise
        .then promiseHandler.bind this, false
        .catch promiseHandler.bind this, true

      pending[key] = handledPromise
      delete rejected[key]

    @setState {pending, rejected}, callback

  _handlePromisedState: (key, promise, caught, value) ->
    # Only change the state if its current value is the same promise that's resolving.
    isLatestPromise = promise is @_promiseStateKeys[key]

    if @isMounted() and isLatestPromise
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
