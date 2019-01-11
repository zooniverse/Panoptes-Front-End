React = require 'react'
createReactClass = require 'create-react-class'
SVGRenderer = require('../../annotation-renderer/svg').default
MarkingsRenderer = require('./markings-renderer').default
TaskTranslations = require('../translations').default

ComboTask = createReactClass
  statics:
    Editor: require './editor'
    Summary: require('./summary').default
    AnnotationRenderer: SVGRenderer

    getDefaultTask: ->
      type: 'combo'
      tasks: []

    getTaskText: (task) ->
      "#{task.tasks.length}-task combo"

    getDefaultAnnotation: (taskDescription, workflow, taskComponents) ->
      taskDescription ?= tasks: []
      value: taskDescription.tasks.map (childTaskKey) ->
        childTaskDescription = workflow.tasks[childTaskKey]
        ChildTaskComponent = taskComponents[childTaskDescription.type]
        defaultAnnotation = ChildTaskComponent.getDefaultAnnotation childTaskDescription, workflow, taskComponents
        Object.assign task: childTaskKey, defaultAnnotation

    isAnnotationComplete: (taskDescription, annotation, workflow) ->
      taskTypes = require('..').default

      method = if taskDescription.loosen_requirements
        'some'
      else
        'every'

      subTasksComplete = annotation.value[method] (subAnnotation, i) =>
        subTaskKey = taskDescription.tasks[i]
        subTaskDescription = workflow.tasks[subTaskKey]
        SubTaskComponent = taskTypes[subTaskDescription.type]
        SubTaskComponent.isAnnotationComplete subTaskDescription, subAnnotation, workflow

    BeforeSubject: (props) ->
      <div>
        {props.task.tasks.map (childTaskKey, i) ->
          childTaskDescription = props.workflow.tasks[childTaskKey]
          TaskComponent = props.taskTypes[childTaskDescription.type]
          # pass only the child annotation down to the various InsideSubject components
          annotation = props.annotation.value[i]
          if TaskComponent.BeforeSubject?
            <TaskComponent.BeforeSubject key={i} {...props} task={childTaskDescription} annotation={annotation} />}
      </div>

    AfterSubject: (props) ->
      <div>
        {props.task.tasks.map (childTaskKey, i) ->
          childTaskDescription = props.workflow.tasks[childTaskKey]
          TaskComponent = props.taskTypes[childTaskDescription.type]
          # pass only the child annotation down to the various InsideSubject components
          annotation = props.annotation.value[i]
          if TaskComponent.AfterSubject?
            <TaskComponent.AfterSubject key={i} {...props} task={childTaskDescription} annotation={annotation} />}
      </div>

    InsideSubject: (props) ->
      <g className="combo-task-inside-subject-container">
        {props.task.tasks.map (childTaskKey, i) ->
          childTaskDescription = props.workflow.tasks[childTaskKey]
          TaskComponent = props.taskTypes[childTaskDescription.type]
          # pass only the child annotation down to the various InsideSubject components
          annotation = props.annotation.value[i]
          if TaskComponent.InsideSubject?
            <TaskComponent.InsideSubject key={i} {...props} task={childTaskDescription} annotation={annotation} />}
      </g>

    PersistInsideSubject: MarkingsRenderer

    getSVGProps: ({task, taskTypes, workflow})->
      task?.tasks?.reduce (svgProps, taskKey) =>
        { type } = workflow.tasks[taskKey]
        taskSVGProps = taskTypes[type].getSVGProps?({ task: workflow.tasks[taskKey] }) ? {}
        Object.assign(svgProps, taskSVGProps)
      , {}

  getDefaultProps: ->
    taskTypes: null
    workflow: null
    task:
      tasks: []
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

        unsupported = TaskComponent is @props.taskTypes.crop

        <div key={i} style={outline: '1px solid red' if unsupported}>
          {if unsupported
            <div className="form-help warning">
              <small>
                <strong>This task might not work as part of a combo at this time.</strong>
              </small>
            </div>}
          <TaskTranslations
            taskKey={annotation.task}
            task={taskDescription}
            workflowID={@props.workflow.id}
          >
            <TaskComponent {...@props} autoFocus={i is 0} task={taskDescription} annotation={annotation} onChange={@handleChange.bind this, i} />
          </TaskTranslations>
        </div>}
    </div>

module.exports = ComboTask
