React = require 'react'
createReactClass = require 'create-react-class'

NOOP = Function.prototype

MAX_TEXT_LENGTH_IN_MENU = 100

module.exports = createReactClass
  displayName: 'NextTaskSelector'

  getDefaultProps: ->
    workflow: null
    name: ''
    value: ''
    isSubtask: false
    onChange: NOOP

  render: ->
    tasks = require('.').default # Work around circular dependency.

    <select name={@props.name} value={@props.value} onChange={@props.onChange}>
      <option value="">(Submit classification and load next subject)</option>
      {for key, definition of @props.workflow.tasks
        unless definition.type is 'shortcut'
          text = tasks[definition.type]?.getTaskText definition
          if text and text.length > MAX_TEXT_LENGTH_IN_MENU
            text = text[0...MAX_TEXT_LENGTH_IN_MENU] + '...'
          <option key={key}, value={key}>{text}</option>}
    </select>
