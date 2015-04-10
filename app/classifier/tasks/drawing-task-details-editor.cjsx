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
        {@props.task.tools[@props.toolIndex].details?.length}
        {for description, i in @props.task.tools[@props.toolIndex].details
          <GenericTaskEditor task={description} onChange={@handleTaskChange.bind this, i} onDelete={@handleTaskDelete.bind this, i} />}
        <button type="button" onClick={@handleAddTask}>Add task</button>
      </div>
    }</ChangeListener>

  handleAddTask: ->
    single = require './single'
    @props.task.tools[@props.toolIndex].details.push single.getDefaultTask()
    @props.workflow.update 'tasks'

  handleTaskChange: (taskIndex, path, value) ->
    changes = {}
    changes["tasks.#{taskIndex}.#{path}"] = value
    @props.workflow.update changes

  handleTaskDelete: (index) ->
    changes["tasks.#{taskIndex}"] = undefined
    @props.workflow.update changes
