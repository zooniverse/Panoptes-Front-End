dispatcher = require '../lib/dispatcher'

class Store
  root: '' # The endpoint to query from and post to, e.g. "/subjects"
  examples: null

  callbacks: null

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
      changeCallbackName = "updateStateWithStore_#{Math.random().toString().split('.')[1]}"

      getCurrentState = ->
        if typeof stateProperties is 'function'
          state = stateProperties.call this

        else
          state = {}

          if typeof stateProperties is 'string'
            state[stateProperties] = store

          else
            for storeProperty, stateProperty of stateProperties
              state[stateProperty] = store[storeProperty]

        state

      Mixin =
        getInitialState: ->
          getCurrentState.call this

        componentDidMount: ->
          store.listen @[changeCallbackName]

        componentWillUnmount: ->
          store.stopListening @[changeCallbackName]

      Mixin[changeCallbackName] = ->
        @setState getCurrentState.call this

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

  fetch: (query) ->
    get = new Promise (resolve, reject) ->
      setTimeout resolve.bind(null, @examples), 1000

    get.then (results) =>
      for result in results
        @items[result.id] = result

module.exports = Store
