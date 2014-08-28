class Model
  constructor: (properties) ->
    for key, value of properties
      @[key] = value

    @callbacks ?= []
    @mixin ?= @generateMixin()

  generateMixin: ->
    model = this

    boundForceUpdate = null

    componentWillMount: ->
      boundForceUpdate = @forceUpdate.bind this
      model.listen boundForceUpdate

    componentWillUnmount: ->
      model.stopListening boundForceUpdate

  listen: (callback) ->
    @callbacks.push callback

  stopListening: (callback) ->
    index = @callbacks.indexOf callback
    unless index is -1
      @callbacks.splice index, 1

  emitChange: ->
    for callback in @callbacks
      callback()

  apply: (fn) ->
    Promise.all([
      fn()
    ]).then @emitChange.bind this

module.exports = Model
