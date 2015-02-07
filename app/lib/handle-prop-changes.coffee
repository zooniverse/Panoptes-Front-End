lookUp = (path, base) ->
  path = path.split '.'
  until path.length is 0
    base = base[path.shift()]
  base

module.exports =
  componentDidMount: ->
    for path, handler of @propChangeHandlers
      if typeof handler is 'string'
        handler = @[handler]
      handler.call this, lookUp path, @props

  componentWillReceiveProps: (nextProps) ->
    for path, handler of @propChangeHandlers
      nextPropValue = lookUp path, nextProps
      unless nextPropValue is lookUp path, @props
        if typeof handler is 'string'
          handler = @[handler]
        handler.call this, nextPropValue
