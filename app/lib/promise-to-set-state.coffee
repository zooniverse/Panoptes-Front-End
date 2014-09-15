# Helper for setting state with a promise:
#   @promiseToSetState foo: getFooReturningPromise()
#
# Then test its progress.
#
# It's still loading:
#   @state.foo instanceof Promise
#
# It's done, but something bad happened:
#   @state.foo instanceof Error
#
# Otherwise it's ready; do whatever you want with it:
#   @state.foo?

module.exports =
  getInitialState: ->
    {} # Let's just ensure that it exists.

  promiseToSetState: (keysAndPromises, callback) ->
    loadingState = {}
    for stateKey, promise of keysAndPromises
      loadingState[stateKey] = promise

    @setState loadingState, =>
      for stateKey, promise of keysAndPromises
        promiseHandler = @_handlePromisedState.bind this, stateKey, promise
        promise.then promiseHandler
        promise.catch promiseHandler

      callback?()

  _handlePromisedState: (stateKey, promise, value) ->
    # Only change the state if its current value is the same promise that's resolving.
    samePromise = @state[stateKey] is promise
    if @isMounted() and samePromise
      valueState = {}
      valueState[stateKey] = value
      @setState valueState
