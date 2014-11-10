class Model
  constructor: (properties) ->
    for key, value of properties
      @[key] = value

    @_callbacks ?= []

  listen: (callback) ->
    @_callbacks.push callback

  stopListening: (callback) ->
    index = @_callbacks.indexOf callback
    unless index is -1
      @_callbacks.splice index, 1

  update: (changes) ->
    for key, value of changes
      @[key] = value
    @emitChange()

  emitChange: ->
    for callback in @_callbacks
      callback()
    @_parent?.emitChange()

  toJSON: ->
    result = {}
    for key, value of this when key.charAt(0) isnt '_'
      result[key] = value
    result

module.exports = Model
