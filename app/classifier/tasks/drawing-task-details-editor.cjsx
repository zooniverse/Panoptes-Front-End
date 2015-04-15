React = require 'react'
ChangeListener = require '../../components/change-listener'

module.exports = React.createClass
  displayName: 'DrawingTaskDetailsEditor'

  getDefaultProps: ->
    workflow: null
    task: null
    toolIndex: NaN

  render: ->
    GenericTaskEditor = require './generic-editor' # Work around circular dependency.
    <ChangeListener target={@props.workflow}>{=>
      <div>
        {for description, i in @props.task.tools[@props.toolIndex].details
          description._key ?= Math.random()
          <GenericTaskEditor key={description._key} task={description} isSubtask={true} onChange={@handleTaskChange.bind this, i} onDelete={@handleTaskDelete.bind this, i} />}
        <button type="button" onClick={@handleAddTask}>Add task</button>
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
