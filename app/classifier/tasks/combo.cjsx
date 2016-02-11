React = require 'react'
DragReorderable = require 'drag-reorderable'

HOOK_KEYS = [
  'BeforeSubject'
  'InsideSubject'
  'AfterSubject'
]

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
    tasks = require '.'
    taskDescription = @props.workflow.tasks[taskKey]
    taskDescription._key ?= Math.random()
    TaskComponent = tasks[taskDescription.type]
    <li key={taskDescription._key}>
      {TaskComponent.getTaskText taskDescription}{' '}
      <button type="button" onClick={@removeTask.bind this, i}>Remove</button>
    </li>

  render: ->
    tasks = require '.'
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

ComboTaskSummary = React.createClass
  render: ->
    <div>(TODO: Combo task summary)</div>

module.exports = React.createClass
  statics:
    Editor: ComboTaskEditor
    Summary: ComboTaskSummary

    getDefaultTask: ->
      type: 'combo'
      tasks: []

    getTaskText: (task) ->
      "#{task.tasks.length}-task combo"

    getDefaultAnnotation: (taskDescription, workflow, taskComponents) ->
      value: taskDescription.tasks.map (childTaskKey) ->
        childTaskDescription = workflow.tasks[childTaskKey]
        ChildTaskComponent = taskComponents[childTaskDescription.type]
        defaultAnnotation = ChildTaskComponent.getDefaultAnnotation childTaskDescription, workflow, taskComponents
        Object.assign task: childTaskKey, defaultAnnotation

    isAnnotationComplete: (task, annotation) ->
      # TODO (Remember to `loosen_requirements` if it's set)
      true

    testAnnotationQuality: (unknown, knownGood) ->
      # TODO
      0.5

    BeforeSubject: (props) ->
      <div>
        {props.task.tasks.map (childTaskKey, i) ->
          childTaskDescription = props.workflow.tasks[childTaskKey]
          TaskComponent = props.taskTypes[childTaskDescription.type]
          annotation = props.annotation.value[i]
          if TaskComponent.BeforeSubject?
            <TaskComponent.BeforeSubject key={i} {...props} task={childTaskDescription} annotation={annotation} />}
      </div>

    AfterSubject: (props) ->
      <div>
        {props.task.tasks.map (childTaskKey, i) ->
          childTaskDescription = props.workflow.tasks[childTaskKey]
          TaskComponent = props.taskTypes[childTaskDescription.type]
          annotation = props.annotation.value[i]
          if TaskComponent.AfterSubject?
            <TaskComponent.AfterSubject key={i} {...props} task={childTaskDescription} annotation={annotation} />}
      </div>

    InsideSubject: (props) ->
      <g className="combo-task-inside-subject-container">
        {props.task.tasks.map (childTaskKey, i) ->
          childTaskDescription = props.workflow.tasks[childTaskKey]
          TaskComponent = props.taskTypes[childTaskDescription.type]
          annotation = props.annotation.value[i]
          if TaskComponent.InsideSubject?
            <TaskComponent.InsideSubject key={i} {...props} task={childTaskDescription} annotation={annotation} />}
      </g>

    PersistInsideSubject: (props) ->
      allComboAnnotations = []
      props.classification.annotations.forEach (annotation) ->
        taskDescription = props.workflow.tasks[annotation.task]
        if taskDescription.type is 'combo'
          allComboAnnotations.push annotation.value...

      <g className="combo-task-persist-inside-subject-container">
        {Object.keys(props.taskTypes).map (taskType) ->
          unless taskType is 'combo'
            TaskComponent = props.taskTypes[taskType]
            if TaskComponent.PersistInsideSubject?
              fauxClassification =
                annotations: allComboAnnotations
              <TaskComponent.PersistInsideSubject key={taskType} {...props} classification={fauxClassification} />}
      </g>

  getDefaultProps: ->
    taskTypes: null
    workflow: null
    task: null
    annotation: null
    onChange: ->

  handleChange: (index, newSubAnnotation) ->
    value = @props.annotation.value.slice 0
    value[index] = newSubAnnotation
    newAnnotation = Object.assign @props.annotation, {value}
    @props.onChange newAnnotation

  render: ->
    <div>
      {@props.task.tasks.map (task, i) =>
        taskDescription = @props.workflow.tasks[task]
        TaskComponent = @props.taskTypes[taskDescription.type]
        annotation = @props.annotation.value[i]

        unsupported = TaskComponent is @props.taskTypes.drawing

        <div key={i} style={outline: '1px solid red' if unsupported}>
          {if unsupported
            <div className="form-help warning">
              <small>
                <strong>This task might not work as part of a combo at this time.</strong>
              </small>
            </div>}
          <TaskComponent {...@props} task={taskDescription} annotation={annotation} onChange={@handleChange.bind this, i} />
        </div>}
    </div>
