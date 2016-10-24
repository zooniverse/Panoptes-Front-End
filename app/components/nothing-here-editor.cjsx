React = require 'react'
AutoSave = require './auto-save'
handleInputChange = require '../lib/handle-input-change'
NothingHere = require '../classifier/tasks/nothing-here'

module.exports = React.createClass
  displayName: 'NothingHereSelector'

  getDefaultProps: ->
    workflow: null
    task: null

  toggleNothingHere: (e) ->
    if e.target.checked
      taskCount = Object.keys(@props.workflow.tasks).length
      taskPrefix = "T#{taskCount}"

      taskIDNumber = -1
      until nextTaskID? and nextTaskID not of @props.workflow.tasks
        taskIDNumber += 1
        nextTaskID = "T#{taskCount + taskIDNumber}"

      changes = {}
      changes["tasks.#{nextTaskID}"] = NothingHere.getDefaultTask(@props.task.question)

      @props.task.unlinkedTask = taskPrefix
      @props.workflow.update changes
      @addAnswer()
    else
      delete @props.workflow.tasks[@props.task.unlinkedTask]
      delete @props.task['unlinkedTask']
      @props.workflow.update 'tasks'

  addAnswer: ->
    @props.workflow.tasks[@props.task.unlinkedTask].answers.push
      label: 'Nothing Here'
    @props.workflow.update 'tasks'

  removeChoice: (index) ->
    @props.workflow.tasks[@props.task?.unlinkedTask].answers.splice index, 1
    @props.workflow.update 'tasks'

  render: ->
    shortcuts = @props.workflow.tasks[@props.task?.unlinkedTask]

    handleChange = handleInputChange.bind @props.workflow

    children = React.Children.map @props.children, (child) =>
      React.cloneElement child

    <div>

      {children}

      <hr />

      <label title="Shortcut Options to End Classification">
        <AutoSave resource={@props.workflow}>
          <span className="form-label">Nothing Here Option</span>{' '}
          <input type="checkbox" checked={shortcuts} onChange={@toggleNothingHere} />
        </AutoSave>
      </label>

      <br />

      <small className="form-help">
        Give volunteers the choice to skip to the end
        of a classification if one of the following options is selected.
      </small>

        {if shortcuts
          <div className="workflow-task-editor-choices">
            {for shortcut, index in shortcuts.answers
              shortcut._key ?= Math.random()
              <div key={shortcut._key} className="workflow-choice-editor">
                <AutoSave resource={@props.workflow}>
                  <textarea name="tasks.#{@props.task.unlinkedTask}.answers.#{index}.label" value={shortcut.label} onChange={handleChange} />
                </AutoSave>

                <AutoSave resource={@props.workflow}>
                  <button type="button" className="workflow-choice-remove-button" title="Remove choice" onClick={@removeChoice.bind this, index}>&times;</button>
                </AutoSave>
              </div>}

              <AutoSave resource={@props.workflow}>
                <button type="button" className="workflow-choice-add-button" title="Add Shortcut" onClick={@addAnswer.bind null, this}>+</button>
              </AutoSave>

            </div>}

      {' '}
    </div>
