React = require 'react'

module.exports = React.createClass
  displayName: 'ProgressButton'

  getDefaultProps: ->
    type: 'button'
    onClick: ->
      Promise.reject 'No `onClick` defined'
    successDuration: 5000

  getInitialState: ->
    busy: false
    success: NaN # Random number, unique per action so success can be forgotten after a few seconds.
    error: null

  render: ->
    <button
      {...@props}
      title={@state.error?.toString()}
      data-busy={@state.busy || null}
      data-success={not isNaN(@state.success) || null}
      data-error={@state.error? || null}
      onClick={@handleClick}>
      {@props.children}
    </button>

  handleClick: ->
    unless @state.busy
      @setState
        busy: true
        success: NaN
        error: null

      @props.onClick.apply(this, arguments)
        .then =>
          success = Math.random()
          @setState {success}

          forgetSuccess = =>
            if @state.success is success
              @setState success: NaN
          setTimeout forgetSuccess, @props.successDuration

        .catch (error) =>
          @setState {error}

        .then =>
          @setState busy: false
