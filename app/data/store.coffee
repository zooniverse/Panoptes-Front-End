{register} = require './dispatcher'

class Store
  path: '/'
  handers: null

  _items: null
  _actions: null

  constructor: (options = {}) ->
    for property, value of options
      @[property] = value

    @_items ?= {} # TODO: Probably make this an array.
    @_actions ?= []

    register this

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
    @_items[item.id] = item
    @emit 'change'

  remove: (item) ->
    @_items[item.id] = null

  filter: (fn) ->
    results = {}
    matches = (item for id, item of @_items when item? and fn item)
    results[match.id] = match for match in matches
    results

module.exports = Store
