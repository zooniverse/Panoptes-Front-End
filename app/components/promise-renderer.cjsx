React = require 'react'

module.exports = React.createClass
  displayName: 'PromiseRenderer'

  propTypes:
    promise: React.PropTypes.instanceOf(Promise).isRequired
    then: React.PropTypes.func.isRequired
    catch: React.PropTypes.func

  getDefaultProps: ->
    catch: @::defaultCatch

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
        @props.then.call this, @state.value
      catch e
        @props.catch.call this, e

    else if @state.rejected
      @props.catch.call this, @state.error

    else
      # Until the promise is resolved or rejected, show the given children.
      @props.children ? null

  defaultCatch: (error) ->
    <code>
      <strong>{error.toString()}</strong>
      {if @props.name?
        <span>&nbsp;({@props.name})</span>}
    </code>
