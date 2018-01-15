React = require 'react'
createReactClass = require 'create-react-class'

module.exports = createReactClass
  displayName: 'ChangeListener'

  getDefaultProps: ->
    target: null
    eventName: 'change'
    on: 'listen'
    off: 'stopListening'
    handler: null

  getInitialState: ->
    payload: []

  componentDidMount: ->
    @startListeningTo @props.target

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.target is @props.target
      @stopListeningTo @props.target
      @startListeningTo nextProps.target

  componentWillUnmount: ->
    @stopListeningTo @props.target

  startListeningTo: (target) ->
    target[@props.on] @props.eventName, @handleTargetChange

  stopListeningTo: (target) ->
    target[@props.off] @props.eventName, @handleTargetChange

  handleTargetChange: (payload...) ->
    if @isMounted()
      @setState {payload}

  render: ->
    if typeof @props.children is 'function'
      @props.children @state.payload...
    else if @props.handler?
      @props.handler @state.payload...
    else
      throw new Error 'ChangeListener needs a child function or handler'
