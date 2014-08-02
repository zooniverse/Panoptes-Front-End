dispatcher = require './dispatcher'

class Store
  _items: null
  _signals: null

  handers: null

  constructor: (options = {}) ->
    @_items = []
    @_signals = []

    for property, value of options
      @[property] = value

    @handlers ?= {}

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

      updateState = ->
        @setState getCurrentState()

      getInitialState: ->
        getCurrentState()

      componentDidMount: ->
        store.on 'change', this, updateState

      componentWillUnmount: ->
        store.off 'change', this, updateState

  on: (signal, [context]..., handler) ->
    @_signals.push {signal, context, handler}

  off: (signal, [context]..., handler) ->
    for {a, c, h}, i in @_signals when a is signal and c is context and h is handler
      index = i
    @_signals.splice index, 1

  emit: (signal, payload) ->
    for {signal: a, context, handler} in @_signals when a is signal
      if typeof handler is 'string'
        handler = context[handler]
      handler.call context, payload

  listen: (callback) ->
    @on 'change', callback

  stopListening: ->
    @off 'change', callback

  emitChange: ->
    @emit 'change'

  set: (property, value) ->
    object = this
    segments = property.split '.'

    until segments.length is 1
      segment = segments.shift()
      object = object[segment]

    object[segments[0]] = value

    @emit 'change'

  add: (items...) ->
    @_items.push items...
    @emit 'change'
    items

  remove: (items...) ->
    for item in items
      index = @_items.indexOf item
      unless index is -1
        @_items.splice index, 1
    items

  filter: (params) ->
    if typeof params is 'function'
      @_items.filter arguments...
    else if typeof params is 'string'
      item for item in @_items when item.id is params
    else
      matches = []
      for item in @_items
        okay = true
        for key, value of params
          unless item[key] is value
            okay = false
            break
        if okay
          matches.push item
      matches

  find: ->
    @filter(arguments...)[0]

window.Store = Store
module.exports = Store
