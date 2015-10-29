React = require 'react'
ReactDOM = require 'react-dom'

FOCUSABLES = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"

ESC_KEY = 27
TAB_KEY = 9

# NOTE: This component probably shouldn't be used directly.
# See the function at ../lib/alert.

module.exports = React.createClass
  displayName: 'Dialog'

  render: ->
    <div className="dialog-underlay" onKeyDown={@handleKeyDown}>
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
    </div>

  handleKeyDown: (e) ->
    switch e.keyCode
      when ESC_KEY
        @props.onEscape? e

      when TAB_KEY
        {shiftKey} = e # Save this; React recycles the event object.
        focusables = ReactDOM.findDOMNode(@).querySelectorAll FOCUSABLES
        if shiftKey and document.activeElement == focusables[0]
          focusables[focusables.length - 1]?.focus()
          e.preventDefault()
        else if !shiftKey and document.activeElement == focusables[focusables.length - 1]
          focusables[0]?.focus()
          e.preventDefault()

