###
  React doesn't fire componentWillReceiveProps for a component's initial props.
  Usually I wish it would.

  createReactClass
    mixins: [HandlePropChanges]

    propChangeHandlers:
      foo: (foo, props) ->
        'This component was mounted with prop foo, or its prop foo changed.'

      'foo.bar.whatever': (whatever, props) ->
        "You can also watch for nested props."

      andAlso: 'givenString'

      givenString: (propValue, props) ->
        'You can assign a prop to a method name to call that method.'
###

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
