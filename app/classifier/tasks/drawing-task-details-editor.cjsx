React = require 'react'
ChangeListener = require '../../components/change-listener'

module.exports = React.createClass
  displayName: 'DrawingTaskDetailsEditor'

  getDefaultProps: ->
    workflow: null
    task: null
    toolIndex: NaN
    onClose: null

  render: ->
    GenericTaskEditor = require './generic-editor' # Work around circular dependency.
    details = @props.task.tools[@props.toolIndex].details
    <ChangeListener target={@props.workflow}>{=>
      <div className="drawing-task-details-editor">
        <div className="sub-tasks">
          {if details.length is 0
            <span className="form-help">No sub-tasks defined for this tool</span>
          else
            for description, i in details
              description._key ?= Math.random()
              <GenericTaskEditor key={description._key} task={description} isSubtask={true} onChange={@handleTaskChange.bind this, i} onDelete={@handleTaskDelete.bind this, i} />}
        </div>

        <div className="commands columns-container">
          <button type="button" className="standard-button" onClick={@props.onClose}>Close</button>
          <button type="button" className="major-button" onClick={@handleAddTask}>Add task</button>
        </div>
      </div>
    }</ChangeListener>

  handleAddTask: ->
    SingleChoiceTask = require './single'
    @props.task.tools[@props.toolIndex].details.push SingleChoiceTask.getDefaultTask()
    @props.workflow.update 'tasks'

  handleTaskChange: (subtaskIndex, path, value) ->
    taskKey = (key for key, description of @props.workflow.tasks when description is @props.task)[0]
    changes = {}
    changes["tasks.#{taskKey}.tools.#{@props.toolIndex}.details.#{subtaskIndex}.#{path}"] = value
    @props.workflow.update changes

  handleTaskDelete: (subtaskIndex) ->
    @props.task.tools[@props.toolIndex].details.splice subtaskIndex, 1
    @props.workflow.update 'tasks'
