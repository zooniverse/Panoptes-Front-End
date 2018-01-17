React = require 'react'
createReactClass = require 'create-react-class'

module.exports = createReactClass
  displayName: 'SingleSubmitButton'

  getDefaultProps: ->
    className: ''
    disabled: false
    type: 'button'
    onClick: Function.prototype

  getInitialState: ->
    disabled: @props.disabled

  onClick: (e) ->
    @setState disabled: true
    promise = @props.onClick e
    if promise
      promise.then =>
        @setState disabled: false
    else
      @setState disabled: false

  render: ->
    <button
      type={@props.type}
      disabled={'disabled' if @state.disabled}
      className={"single-submit-button #{ @props.className }"}
      onClick={@onClick}>
      {@props.children}
    </button>
