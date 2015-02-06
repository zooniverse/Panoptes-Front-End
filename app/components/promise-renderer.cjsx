React = require 'react'

module.exports = React.createClass
  displayName: 'PromiseRenderer'

  getDefaultProps: ->
    promise: Promise.reject()
    pendingClass: 'promise-pending'
    tag: 'span'
    then: @::defaultThen
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
      @safelySetState promise,
        pending: false
        resolved: true
        rejected: false
        value: value
        error: null

    promise.catch (error) =>
      @safelySetState promise,
        pending: false
        resolved: false
        rejected: true
        value: null
        error: error

  safelySetState: (promise, state) ->
    if @isMounted() and promise is @props.promise
      @setState state

  render: ->
    if @state.resolved
      try
        @renderResolved @state.value
      catch error
        @renderRejected error

    else if @state.rejected
      @renderRejected @state.error

    else
      # Until the initial promise is resolved or rejected, show the given children.
      @props.children ? null

  componentDidUpdate: (prevProps, prevState) ->
    classList = @getDOMNode()?.classList
    if @state.pending
      classList?.add @props.pendingClass
    else
      classList?.remove @props.pendingClass

  renderResolved: (value) ->
    if typeof @props.then is 'string'
      @renderSimpleLookup value, @props.then.split '.'
    else
      @props.then.call this, value

  renderSimpleLookup: (value, path) ->
    until path.length is 0
      value = value[path.shift()]
    React.createElement @props.tag, @props, value

  renderRejected: (error) ->
    @props.catch.call this, error

  defaultThen: (value) ->
    React.createElement @props.tag, @props, value

  defaultCatch: (error) ->
    React.createElement @props.tag, @props, <code>{error.toString()}</code>
