React = require 'react'

FOCUSABLES = 'input, textarea, button, select, [tabindex]'

ESC_KEY = 27
TAB_KEY = 9

# NOTE: This component probably shouldn't be used directly.
# See the function at ../lib/alert.

module.exports = React.createClass
  displayName: 'Dialog'

  render: ->
    <div className="dialog-underlay" onKeyDown={@handleKeyDown}>
      <div className="dialog">
        <div className="dialog-controls">
          <div className="wrapper">{@props.controls}</div>
        </div>
        <div className="dialog-content">
          <div className="wrapper">
            {@props.children}
          </div>
        </div>
      </div>
    </div>

  handleKeyDown: (e) ->
    switch e.keyCode
      when ESC_KEY
        @props.onEscape? e

      when TAB_KEY
        {shiftKey} = e # Save this; React recycles the event object.
        setTimeout => # Give document.activeElement time to change.
          if document.activeElement not in @getDOMNode().querySelectorAll '*'
            if shiftKey
              @focusLast()
            else
              @focusFirst()

  focusFirst: ->
    @getDOMNode().querySelector(FOCUSABLES)?.focus()

  focusLast: ->
    focusables = @getDOMNode().querySelectorAll FOCUSABLES
    focusables[focusables.length - 1]?.focus()
