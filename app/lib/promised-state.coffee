module.exports =
  getInitialState: ->
    { }

  promiseToSetState: (keysAndPromises) ->
    for key, promise of keysAndPromises
      newState = { }
      promise.then (value) =>
        newState[key] = value
        @setState newState if @isMounted()
      .catch (error) =>
        error = new Error(error) unless error instanceof Error
        newState[key] = error
        @setState newState if @isMounted()
