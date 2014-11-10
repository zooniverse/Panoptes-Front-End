# Proxy emitted events to React state
# 
# module.exports = React.createClass
#   mixins: [eventedState]
#   
#   componentWillMount: ->
#     # will call @setState someState: emittedValue
#     @eventedState from: someEmitter, on: 'anEvent', set: 'someState'
#     
#     # custom state setting
#     @eventedState from: someEmitter, on: 'anEvent', set: (value) =>
#       @setState someState: "custom #{ value }"

module.exports =
  getInitialState: ->
    @_eventedStates or= { }
    { }

  componentWillUnmount: ->
    for key, handler of @_eventedStates
      handler.from.off handler.on, handler
    @_eventedStates = { }

  eventedState: (opts) ->
    opts.set = @_eventedStateSetter opts.set
    handler = @_eventedHandlerFor opts
    @_eventedStates[opts.on] = handler
    opts.from.on opts.on, handler

  _eventedHandlerFor: (opts) ->
    handler = ( (ev, args...) ->
      this.set args...
    ).bind opts
    handler[key] = value for key, value of opts
    handler

  _eventedStateSetter: (keyOrFn) ->
    return keyOrFn if typeof keyOrFn is 'function'
    (value) =>
      newState = { }
      newState[keyOrFn] = value
      @setState newState if @isMounted()
