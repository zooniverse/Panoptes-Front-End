React = require 'react'
createReactClass = require 'create-react-class'
DragReorderable = require 'drag-reorderable'
NextTaskSelector = require '../next-task-selector'

ComboTaskEditor = createReactClass
  getDefaultProps: ->
    workflow: null
    task: null
    onChange: ->

  componentWillMount: () ->
    @props.task.tasks.map (taskKey, i) =>
      unless @props.workflow.tasks[taskKey]
        @removeTask(i)

  removeTask: (index) ->
    @props.task.tasks.splice index, 1
    @props.onChange @props.task

  setOrder: (taskKeys) ->
    @props.task.tasks = taskKeys
    @props.onChange @props.task

  addTask: (e) ->
    taskKey = e.target.value
    @props.task.tasks.push taskKey
    @props.onChange @props.task

  setLooseRequirements: (e) ->
    value = JSON.parse e.target.value
    @props.task.loosen_requirements = value
    @props.onChange @props.task

  setNextTask: (e) ->
    @props.task.next = e.target.value
    @props.onChange @props.task

  renderSubtask: (taskKey, i) ->
    tasks = require('..').default
    taskDescription = @props.workflow.tasks[taskKey]
    taskDescription._key ?= Math.random()
    TaskComponent = tasks[taskDescription.type]
    <li key={taskDescription._key}>
      {TaskComponent.getTaskText taskDescription}{' '}
      <button type="button" onClick={@removeTask.bind this, i}>Remove</button>
    </li>

  render: ->
    tasks = require('..').default
    <div>
      <p>Add any number of tasks here and they'll be shown in one step.</p>
      {if @props.task.tasks.length is 0
        <p className="form-help">No tasks in this combo.</p>
      else
        <DragReorderable tag="ul" items={@props.task.tasks} render={@renderSubtask} onChange={@setOrder} />}
      <p>
        <label>
          Add a task:{' '}
          <select value="stuck" onChange={@addTask}>
            <option value="stuck" disabled>Tasks...</option>
            {Object.keys(@props.workflow.tasks).map (taskKey) =>
              taskDescription = @props.workflow.tasks[taskKey]
              TaskComponent = tasks[taskDescription.type]
              <option key={taskKey} value={taskKey} disabled={taskDescription.type is 'crop'}>{TaskComponent.getTaskText taskDescription}</option>}
          </select>
        </label>
      </p>
      <p>
        This task’s requirements are met when{' '}
        <select value={@props.task.loosen_requirements} onChange={@setLooseRequirements}>
          <option value="false">all</option>
          <option value="true">any</option>
        </select>{' '}
        of its sub-tasks’ requirements are met.
      </p>
      <p>
        <label>
          Next task:{' '}
          <NextTaskSelector workflow={@props.workflow} value={@props.task.next} onChange={@setNextTask} />
        </label>
        <br />
        <span className="form-help">This overrides anything set by a sub-task.</span>
      </p>
    </div>

module.exports = ComboTaskEditor
