# Proxy promises to React state
# 
# module.exports = React.createClass
#   mixins: [promisedState]
#   
#   componentWillMount: ->
#     # will call @setState someState: 'foo'
#     @promiseToSetState someState: Promise.resolve('foo')
#     
#     # will call
#     #   @setState someStateLoading: true
#     #   @setState someState: 'bar', someStateLoading: false
#     @promiseToSetState someState: Promise.resolve('bar'), { loadingState: true }
#     
#     # will call @setState someState: 'foo', otherState: 'bar' once both promises have resolved
#     @promiseToSetState someState: Promise.resolve('foo'), otherState: Promise.resolve('bar'), { waitForAll }

module.exports =
  getInitialState: ->
    { }

  promiseToSetState: (keysAndPromises, { waitForAll, loadingState } = { }) ->
    promises = []
    for key, promise of keysAndPromises
      promise = Promise.resolve(promise) unless promise instanceof Promise
      @_setPromiseLoading(key) if loadingState
      promises.push @_statefulPromise key, promise, loadingState

    if waitForAll then Promise.all(promises) else promises

  _statefulPromise: (key, promise, loadingState) ->
    promise.then (value) =>
      @_fulfillPromise key, value, loadingState
    .catch (error) =>
      error.error = true
      @_fulfillPromise key, error, loadingState

  _setPromiseLoading: (key) ->
    loading = { }
    loading["#{ key }Loading"] = true
    @setState loading

  _fulfillPromise: (key, value, loadingState) ->
    newState = { }
    newState["#{ key }Loading"] = false if loadingState
    newState[key] = value
    @setState newState if @isMounted()
    value
