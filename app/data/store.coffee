dispatcher = require '../lib/dispatcher'

class Store
  root: '' # The endpoint to query from and post to, e.g. "/subjects"
  keyedOn: 'id'
  examples: []

  constructor: (options = {}) ->
    @items = {}
    @callbacks = []
    @mixInto = @_generateMixIntoMethod()

    for property, value of options
      @[property] = value

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

        componentWillMount: ->
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

  create: (instance) ->
    if @type?
      instance = new @type instance

    key = instance[@keyedOn] ? Math.random().toString().split('.')[1]
    @items[key] = instance
    @items[key]

  get: (query, enough = Infinity) ->
    if typeof query is 'string'
      new Promise (resolve) =>
        [key, query] = [query, {}]
        query[@keyedOn] = key
        @items[key] ?= @fetch(query).then ([result]) => result
        resolve @items[key]
    else
      matches = (item for key, item of @items when item? and @matchesQuery item, query)

      if matches.length < enough
        @fetch(query).then (results) =>
          for result in results
            @items[result[@keyedOn]] = result
      else
        new Promise (resolve) ->
          resolve matches

  fetch: (query) ->
    fetchItems = new Promise (resolve, reject) =>
      console?.info 'GET', @root, JSON.stringify query
      matches = (item for item in @examples when @matchesQuery item, query)
      setTimeout resolve.bind(null, matches), 1000

    fetchItems.then (results) =>
      console?.info 'Got', @root, {results}
      for item in results
        @items[item[@keyedOn]] = item
      @emitChange()
      results

  matchesQuery: (item, query) ->
    match = true
    for key, value of query
      unless item[key] is value
        match = false
    match

  @Model: class
    constructor: (properties) ->
      for key, value of properties
        @[key] = value

module.exports = Store
