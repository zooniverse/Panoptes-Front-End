React = require 'react'
ReactDOM = require 'react-dom'

WorkflowCopyDialog = React.createClass
  getDefaultProps: ->
    onCancel: ->
    onSubmit: ->
    onSuccess: ->
    workflow: {}

  getInitialState: ->
    busy: false
    error: null
    tasks: true
    configuration: true
    retirement: true

  handleChange: (property, e) ->
    newState = {}
    newState[property] = e.target.checked
    @setState newState

  handleSubmit: (e) ->
    e.preventDefault()

    if not @refs.newDisplayName.value
      return window.alert('Please provide a new workflow title')

    @setState
      busy: true
      error: null

    newWorkflow =
      display_name: @refs.newDisplayName.value
      links:
        project: @props.workflow.links.project

    if @state.tasks
      newWorkflow.tasks = @props.workflow.tasks
      newWorkflow.first_task = @props.workflow.first_task
    else
      newWorkflow.tasks =
        init:
          type: 'single'
          question: 'Ask your first question here.'
          answers: [
            label: 'Yes'
          ]
      newWorkflow.first_task = 'init'
    if @state.configuration
      newWorkflow.configuration = @props.workflow.configuration
    if @state.retirement
      newWorkflow.retirement = @props.workflow.retirement

    awaitSubmission = @props.onSubmit(newWorkflow)

    Promise.resolve(awaitSubmission)
      .then (result) =>
        @setState busy: false
        @props.onSuccess result
      .catch (error) =>
        @setState {error}

  render: ->
    <form onSubmit={@handleSubmit} style={maxWidth: '90vw', width: '30ch'}>
      <label>
        <span className="form-label">New Workflow Title</span>
        <br />
        <input className="standard-input full" type="text" ref="newDisplayName" defaultValue="Copy of #{@props.workflow.display_name}" autoFocus></input>
      </label>
      <br />
      <label>
        <input type="checkbox" ref="tasks" onChange={@handleChange.bind(@, "tasks")} defaultChecked></input>{' '}Tasks
      </label>
      <br />
      <label>
        <input type="checkbox" ref="configuration" onChange={@handleChange.bind(@, "configuration")} defaultChecked></input>{' '}Multi-Image Options
      </label>
      <br />
      <label>
        <input type="checkbox" ref="retirement" onChange={@handleChange.bind(@, "retirement")} defaultChecked></input>{' '}Subject Retirement
      </label>
      <br />
      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>}
      <p style={textAlign: 'center'}>
        <button type="button" className="minor-button" disabled={@state.busy} onClick={@props.onCancel}>Cancel</button>{' '}
        <button type="submit" className="major-button" disabled={@state.busy}>Save</button>
      </p>
    </form>

module.exports = WorkflowCopyDialog
