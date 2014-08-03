dispatcher = require './dispatcher'

class Store
  callbacks: null

  handers: null

  constructor: (options = {}) ->
    @callbacks = []

    for property, value of options
      @[property] = value

    @mixInto = @_generateMixIntoMethod()

    dispatcher.register this

  _generateMixIntoMethod: ->
    # Here's a shortcut mixin to keep React components state up to date with stores' properties.
    # To indicate that the store's `foo` should be passed as the component's state's `bar`:
    # React.createClass({
    #   mixins: [store.mixInto({foo: bar})]
    # });

    store = this

    (stateProperties) ->
      getCurrentState = ->
        state = {}

        if typeof stateProperties is 'string'
          state[stateProperties] = store

        else
          for storeProperty, stateProperty of stateProperties
            state[stateProperty] = store[storeProperty]

        state

      changeCallbackName = "updateStateWithStore_#{Math.random().toString().split('.')[1]}"

      Mixin =
        getInitialState: ->
          getCurrentState()

        componentDidMount: ->
          store.listen @[changeCallbackName]

        componentWillUnmount: ->
          store.stopListening @[changeCallbackName]

      Mixin[changeCallbackName] = ->
        @setState getCurrentState()

      Mixin


  listen: (callback) ->
    @callbacks.push callback

  stopListening: (callback) ->
    index = @callbacks.indexOf callback
    unless index is -1
      @callbacks.splice index, 1

  emitChange: ->
    for callback in @callbacks
      callback()

  set: (property, value) ->
    object = this
    segments = property.split '.'

    until segments.length is 1
      segment = segments.shift()
      object = object[segment]

    object[segments[0]] = value

    @emitChange()

module.exports = Store
