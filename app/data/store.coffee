dispatcher = require '../lib/dispatcher'
Model = require './model'

class Store extends Model
  @Model: Model # TODO: This is a mess, I know, I gotta sort this all out.

  root: '' # The endpoint to query from and post to, e.g. "/subjects"
  keyedOn: 'id'
  examples: []

  constructor: (options = {}) ->
    @items = {}
    @mixInto = @_generateMixIntoMethod()

    super

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

  create: (instance) ->
    if @type?
      instance = new @type instance

    key = instance[@keyedOn] ? Math.random().toString().split('.')[1]
    instance[@keyedOn] = key
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
      console?.info 'GET', @root, query
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

module.exports = Store
