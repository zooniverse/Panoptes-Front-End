React = require 'react'

# TODO: Maybe infer the on/off methods from a list if none is specified:
# ON_OFF_METHODS =
#   addEventListener: 'removeEventListener' # DOM elements
#   addListener: 'removeListener' # Node EventEmitter class
#   listen: 'stopListening' # Panoptes Model and JSONAPIClient Resource classes (change this to match Node?)
#   on: 'off' # jQuery-ish

module.exports = React.createClass
  displayName: 'ChangeListener'

  propTypes:
    target: React.PropTypes.any.isRequired
    eventName: React.PropTypes.string
    on: React.PropTypes.string
    off: React.PropTypes.string
    handler: React.PropTypes.func.isRequired

  getDefaultProps: ->
    on: 'listen'
    off: 'stopListening'

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
    target[@props.on] @getListenerArgs()...

  stopListeningTo: (target) ->
    target[@props.off] @getListenerArgs()...

  getListenerArgs: ->
    args = [@handleTargetChange]
    if @props.eventName?
      args.unshift @props.eventName
    args

  handleTargetChange: (payload...) ->
    if @isMounted()
      @setState {payload}

  render: ->
    # TODO: Figure out why returning `@props.children` here fails to re-render them on change.
    # Then we can remove the requirement for a separate `handler` function.
    @props.handler @state.payload...
