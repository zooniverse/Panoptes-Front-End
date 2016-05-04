React = require 'react'
SetToggle = require '../lib/set-toggle'

module.exports = React.createClass
  displayName: "WorkflowToggle"

  mixins: [SetToggle]

  getDefaultProps: ->
    workflow: null
    project: null
    field: null

  getInitialState: ->
    error: null
    setting: {}

  setterProperty: 'workflow'

  render: ->
    workflow = @props.workflow
    setting = workflow[@props.field]
    <span>
      { workflow.id } - { workflow.display_name}:
      <label style={whiteSpace: 'nowrap'}>
        <input type="checkbox" name={@props.field} value={setting} checked={setting} onChange={@set.bind this, @props.field, not setting} />
        Active
      </label>
    </span>
