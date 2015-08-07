React = require 'react'

NOOP = Function.prototype

MAX_TEXT_LENGTH_IN_MENU = 100

module.exports = React.createClass
  displayName: 'NextTaskSelector'

  getDefaultProps: ->
    workflow: null
    name: ''
    value: ''
    isSubtask: false
    onChange: NOOP

  render: ->
    tasks = require '.' # Work around circular dependency.

    <select name={@props.name} value={@props.value} onChange={@props.onChange}>
      <option value="">(End of classification!)</option>
      {for key, definition of @props.workflow.tasks
        text = tasks[definition.type].getTaskText definition
        if text.length > MAX_TEXT_LENGTH_IN_MENU
          text = text[0...MAX_TEXT_LENGTH_IN_MENU] + '...'
        <option key={key}, value={key}>{text}</option>}
    </select>
