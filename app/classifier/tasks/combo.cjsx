React = require 'react'

HOOK_KEYS = [
  'BeforeSubject'
  'InsideSubject'
  'AfterSubject'
]

module.exports = React.createClass
  statics:
    getDefaultTask: ->
      type: 'combo'
      tasks: []

    getTaskText: (task) ->
      "#{tasks.tasks.length}-task combo"

    getDefaultAnnotation: (taskDescription, workflow, taskComponents) ->
      value: taskDescription.tasks.map (childTaskKey) ->
        childTaskDescription = workflow.tasks[childTaskKey]
        ChildTaskComponent = taskComponents[childTaskDescription.type]
        defaultAnnotation = ChildTaskComponent.getDefaultAnnotation childTaskDescription, workflow, taskComponents
        Object.assign task: childTaskKey, defaultAnnotation

    isAnnotationComplete: (task, annotation) ->
      # TODO
      true

    testAnnotationQuality: (unknown, knownGood) ->
      # TODO
      0.5

  getDefaultProps: ->
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

        taskNeedsHooks = HOOK_KEYS.some (hookKey) =>
          hookKey of TaskComponent

        <div key={i} style={outline: '1px solid red' if taskNeedsHooks}>
          {if taskNeedsHooks
            <div className="form-help warning">
              <small>
                <strong>This task might not work as part of a combo at this time.</strong>
              </small>
            </div>}
          <TaskComponent {...@props} task={taskDescription} annotation={annotation} onChange={@handleChange.bind this, i} />
        </div>}
    </div>
