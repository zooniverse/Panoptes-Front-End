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
#     @promiseToSetState someState: Promise.resolve('bar')
#     
#     # will call @setState someState: 'foo', otherState: 'bar' once both promises have resolved
#     @promiseToSetState someState: Promise.resolve('foo'), otherState: Promise.resolve('bar')

module.exports =
  getInitialState: ->
    { }

  promiseToSetState: (keysAndPromises) ->
    promises = []
    for key, promise of keysAndPromises
      promise = Promise.resolve(promise) unless promise instanceof Promise
      @_setPromiseLoading key
      promises.push @_statefulPromise key, promise

    Promise.all promises

  _statefulPromise: (key, promise) ->
    promise.then (value) =>
      @_fulfillPromise key, value
    .catch (error) =>
      error.error = true
      @_fulfillPromise key, error

  _setPromiseLoading: (key) ->
    loading = { }
    loading["#{ key }Loading"] = true
    @setState loading

  _fulfillPromise: (key, value) ->
    newState = { }
    newState["#{ key }Loading"] = false
    newState[key] = value
    @setState newState if @isMounted()
    value
