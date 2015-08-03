module.exports =
  set: (property, value) ->
    @state.error = null
    @state.setting[property] = true
    @forceUpdate()

    changes = {}
    changes[property] = value

    @props[@setterProperty].update(changes).save()
      .catch (error) =>
        @setState {error}
      .then =>
        @state.setting[property] = false
        @forceUpdate()

