React = require 'react'
AutoSave = require '../../components/auto-save'

module.exports = React.createClass
  displayName: 'NothingHereSelector'

  getDefaultProps: ->
    workflow: null
    task: null

  toggleNothingHere: (e) ->
    @props.task.nothingHere = if e.target.checked
      true
    else
      false
    @props.workflow.update 'tasks'

  render: ->
    nothingHelp = 'Check this box to give the volunteer an option to skip to the end of a classification if a subject does not contain relevant information.'

    <div>
      <label title={nothingHelp}>
        <AutoSave resource={@props.workflow}>
          <span className="form-label">Nothing Here Option</span>{' '}
          <input type="checkbox" checked={@props.task.nothingHere} onChange={@toggleNothingHere} />
        </AutoSave>
      </label>
      {' '}
    </div>
