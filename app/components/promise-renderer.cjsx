React = require 'react'

DEFAULT_RENDER_FAILURE = (error) ->
  <strong>
    <code>{error.toString()}</code>
  </strong>

module.exports = React.createClass
  displayName: 'PromiseRenderer'

  propTypes:
    promise: React.PropTypes.instanceOf(Promise).isRequired
    then: React.PropTypes.func.isRequired
    catch: React.PropTypes.func

  getDefaultProps: ->
    catch: DEFAULT_RENDER_FAILURE

  getInitialState: ->
    resolved: false
    rejected: false
    value: null
    error: null

  componentDidMount: ->
    @attachTo @props.promise

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.promise is @props.promise
      @attachTo nextProps.promise

  attachTo: (promise) ->
    @setState @getInitialState()

    promise.then (value) =>
      @safelySetState
        resolved: true
        value: value

    promise.catch (error) =>
      @safelySetState
        rejected: true
        error: error

  safelySetState: (state) ->
    if @isMounted()
      @setState state

  render: ->
    if @state.resolved
      try
        @props.then @state.value
      catch e
        @props.catch e

    else if @state.rejected
      @props.catch @state.error

    else
      # Until the promise is resolved or rejected, show the given children.
      @props.children ? null
