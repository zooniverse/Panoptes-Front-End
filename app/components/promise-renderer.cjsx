React = require 'react'
createReactClass = require 'create-react-class'
HandlePropChanges = require '../lib/handle-prop-changes'

module.exports = createReactClass
  displayName: 'PromiseRenderer'

  mixins: [HandlePropChanges]

  getDefaultProps: ->
    promise: null
    tag: 'div'
    pending: @::defaultPending
    then: @::defaultThen
    catch: @::defaultCatch

  getInitialState: ->
    state: 'pending'
    value: null
    error: null

  propChangeHandlers:
    promise: 'attachTo'

  attachTo: (promise) ->
    @setState
      state: 'pending'

    promise.then (value) =>
      @safelySetState promise,
        state: 'resolved'
        value: value
        error: null

    promise.catch (error) =>
      @safelySetState promise,
        state: 'rejected'
        value: null
        error: error

  safelySetState: (promise, state) ->
    if @isMounted() and promise is @props.promise
      @setState state

  render: ->
    result = try
      switch @state.state
        when 'pending' then @renderPending()
        when 'resolved' then @renderResolved @state.value
        when 'rejected' then @renderRejected @state.error
    catch error
      @renderRejected error

    result ? null

  renderPending: ->
    if @state.value?
      @renderResolved @state.value
    else
      if typeof @props.pending is 'string'
        @defaultPending @props.pending
      else if @props.pending?
        @props.pending.call this

  renderResolved: (value) ->
    if typeof @props.children is 'function'
      @props.children(value) ? null
    else if @props.then?
      if typeof @props.then is 'string'
        @renderSimpleLookup value, @props.then
      else
        @props.then.call this, value

  renderSimpleLookup: (value, path) ->
    path = path.split '.'
    until path.length is 0
      value = value[path.shift()]
    React.createElement @props.tag, @props, value

  renderRejected: (error) ->
    if @props.catch
      try
        @props.catch.call this, error
      catch secondError
        @defaultCatch secondError

  defaultPending: (message) ->
    React.createElement @props.tag, @props, message ? null

  defaultThen: (value) ->
    React.createElement @props.tag, @props, value

  defaultCatch: (error) ->
    React.createElement @props.tag, @props, error.toString()
