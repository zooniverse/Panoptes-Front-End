React = require 'react'

ComboTask = React.createClass
  statics:
    Editor: require './editor'
    Summary: require './summary'

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

    isAnnotationComplete: (taskDescription, annotation, workflow) ->
      taskTypes = require '..'

      method = if taskDescription.loosen_requirements
        'some'
      else
        'every'

      subTasksComplete = annotation.value[method] (subAnnotation, i) =>
        subTaskKey = taskDescription.tasks[i]
        subTaskDescription = workflow.tasks[subTaskKey]
        SubTaskComponent = taskTypes[subTaskDescription.type]
        SubTaskComponent.isAnnotationComplete subTaskDescription, subAnnotation, workflow

    testAnnotationQuality: (unknown, knownGood, workflow) ->
      testClassificationQuality = require '../../../lib/test-classification-quality'
      fauxUnknownClassification = annotations: unknown.value
      fauxKnownGoodClassification = annotations: knownGood.value
      testClassificationQuality fauxUnknownClassification, fauxKnownGoodClassification, workflow

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

module.exports = ComboTask
