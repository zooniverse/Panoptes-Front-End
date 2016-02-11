React = require 'react'
DragReorderable = require 'drag-reorderable'

ComboTaskEditor = React.createClass
  getDefaultProps: ->
    workflow: null
    task: null
    onChange: ->

  removeTask: (index) ->
    @props.task.tasks.splice index, 1
    @props.onChange @props.task

  setOrder: (taskKeys) ->
    @props.task.tasks = taskKeys
    @props.onChange @props.task

  addTask: (e) ->
    taskKey = e.target.value
    @props.task.tasks.push taskKey
    console.log '>>>', @props.task
    @props.onChange @props.task

  setLooseRequirements: (e) ->
    value = JSON.parse e.target.value
    @props.task.loosen_requirements = value
    @props.onChange @props.task

  renderSubtask: (taskKey, i) ->
    tasks = require '..'
    taskDescription = @props.workflow.tasks[taskKey]
    taskDescription._key ?= Math.random()
    TaskComponent = tasks[taskDescription.type]
    <li key={taskDescription._key}>
      {TaskComponent.getTaskText taskDescription}{' '}
      <button type="button" onClick={@removeTask.bind this, i}>Remove</button>
    </li>

  render: ->
    tasks = require '..'
    <div>
      <p>Add any number of tasks here and they'll be shown in one step.</p>
      {if @props.task.tasks.length is 0
        <p className="form-help">No tasks in this combo.</p>
      else
        <DragReorderable tag="ul" items={@props.task.tasks} render={@renderSubtask} onChange={@setOrder} />}
      <p>
        <select value="stuck" onChange={@addTask}>
          <option value="stuck" disabled>Add a task...</option>
          {Object.keys(@props.workflow.tasks).map (taskKey) =>
            taskDescription = @props.workflow.tasks[taskKey]
            TaskComponent = tasks[taskDescription.type]
            <option key={taskKey} value={taskKey}>{TaskComponent.getTaskText taskDescription}</option>}
        </select>
      </p>
      <p>
        This task’s requirements are met when{' '}
        <select value={@props.task.loosen_requirements} onChange={@setLooseRequirements}>
          <option value="false">all</option>
          <option value="true">any</option>
        </select>{' '}
        of its sub-tasks’ requirements are met.
      </p>
    </div>

module.exports = ComboTaskEditor
