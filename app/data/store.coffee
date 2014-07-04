dispatcher = require './dispatcher'

class Store
  path: '/'
  handers: null

  _items: null
  _actions: null

  constructor: (options = {}) ->
    for property, value of options
      @[property] = value

    @_items ?= []
    @_actions ?= []

    dispatcher.register this

  on: (action, [context]..., handler) ->
    @_actions.push {action, context, handler}

  off: (action, [context]..., handler) ->
    for {a, c, h}, i in @_actions when a is action and c is context and h is handler
      index = i
    @_actions.splice index, 1

  emit: (action, payload) ->
    for {action: a, context, handler} in @_actions when a is action
      if typeof handler is 'string'
        handler = context[handler]
      handler.call context, payload

  fetch: (params) ->
    request.get @path, params, (response) =>
      # TODO?
      @emit 'change'

  set: (property, value) ->
    object = this
    segments = property.split '.'

    until segments.length is 1
      segment = segments.shift()
      object = object[segment]

    object[segments[0]] = value

    @emit 'change'

  add: (item) ->
    @_items.push item
    @emit 'change'

  remove: (item) ->
    index = @_items.indexOf item
    @_items.splice index, 1

  filter: (params) ->
    if typeof params is 'function'
      @_items.filter arguments...
    else if typeof params is 'string'
      @filter (item) -> item.id is params
    else
      # TODO: Allow filtering by properties.

module.exports = Store
