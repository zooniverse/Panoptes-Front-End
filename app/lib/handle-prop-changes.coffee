lookUp = (path, base) ->
  path = path.split '.'
  until path.length is 0
    base = base[path.shift()]
  base

module.exports =
  componentDidMount: ->
    for path, handler of @propChangeHandlers
      try
        propValue = lookUp path, @props
      catch
        lookupFailed = true
      unless lookupFailed
        if typeof handler is 'string'
          handler = @[handler]
        handler.call this, propValue, @props

  componentWillReceiveProps: (nextProps) ->
    for path, handler of @propChangeHandlers
      try
        currentPropValue = lookUp path, @props
        nextPropValue = lookUp path, nextProps
      catch
        lookupFailed = true
      unless lookupFailed or nextPropValue is currentPropValue
        if typeof handler is 'string'
          handler = @[handler]
        handler.call this, nextPropValue, nextProps
