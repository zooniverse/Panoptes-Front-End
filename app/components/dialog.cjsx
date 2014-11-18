React = require 'react'

FOCUSABLES = 'input, textarea, button, select, [tabindex]'

ESC_KEY = 27
TAB_KEY = 9

# NOTE: This component probably shouldn't be used directly.
# See the function at ../lib/alert.

module.exports = React.createClass
  displayName: 'Dialog'

  getInitialState: ->
    closed: false

  previousActiveElement: null

  componentDidMount: ->
    @previousActiveElement = document.activeElement
    @focusFirst()

  componentWillUnmount: ->
    @previousActiveElement?.focus()

  focusFirst: ->
    @getDOMNode().querySelector(FOCUSABLES)?.focus()

  focusLast: ->
    focusables = @getDOMNode().querySelectorAll FOCUSABLES
    focusables[focusables.length - 1]?.focus()

  close: ->
    @setState closed: true, =>
      @props.onClose?()

  render: ->
    if @state.closed
      null

    else
      <div className="dialog-underlay">
        <div className="dialog-content" onKeyDown={@handleKeyDown}>
          {@props.children}
        </div>
      </div>

  handleKeyDown: ({keyCode, shiftKey}) ->
    if keyCode is ESC_KEY
      @close()

    else if keyCode is TAB_KEY
      setTimeout => # Give document.activeElement a cycle to change.
        if document.activeElement not in @getDOMNode().querySelectorAll '*'
          if shiftKey
            @focusLast()
          else
            @focusFirst()
