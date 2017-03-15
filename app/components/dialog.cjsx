React = require 'react'
ReactDOM = require 'react-dom'
ModalFocus = require('./modal-focus').default

# NOTE: This component probably shouldn't be used directly.
# See the function at ../lib/alert.

module.exports = React.createClass
  displayName: 'Dialog'

  render: ->
    <ModalFocus className="dialog-underlay" onEscape={@props.onEscape}>
      <div aria-role='dialog' className="dialog">
        <div className="dialog-controls">
          <div className="wrapper">{@props.controls}</div>
        </div>
        <div className="dialog-content">
          <div className="wrapper">
            {@props.children}
          </div>
        </div>
      </div>
    </ModalFocus>

