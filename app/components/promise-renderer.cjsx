React = require 'react'

module.exports = React.createClass
  displayName: 'PromiseRenderer'

  pendingClass: 'promise-pending'

  propTypes:
    promise: React.PropTypes.instanceOf(Promise).isRequired
    then: React.PropTypes.func.isRequired
    catch: React.PropTypes.func

  getDefaultProps: ->
    catch: @::defaultCatch

  getInitialState: ->
    pending: false
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
    @setState
      pending: true

    promise.then (value) =>
      @safelySetState
        pending: false
        resolved: true
        rejected: false
        value: value
        error: null

    promise.catch (error) =>
      @safelySetState
        pending: false
        resolved: false
        rejected: true
        value: null
        error: error

  safelySetState: (state) ->
    if @isMounted()
      @setState state

  render: ->
    if @state.resolved
      try
        @props.then.call this, @state.value
      catch e
        @props.catch.call this, e

    else if @state.rejected
      @props.catch.call this, @state.error

    else
      # Until the initial promise is resolved or rejected, show the given children.
      @props.children ? null

  componentDidUpdate: (prevProps, prevState) ->
    classList = @getDOMNode()?.classList
    if @state.pending
      classList?.add @pendingClass
    else
      classList?.remove @pendingClass

  defaultCatch: (error) ->
    <code>
      <strong>{error.toString()}</strong>
    </code>
