React = require 'react'
createReactClass = require 'create-react-class'
CropInitializer = require './initializer'
GenericTask = require('../generic.jsx').default
GenericEditor = require '../generic-editor'
Summary = require './summary'
SVGRenderer = require('../../annotation-renderer/svg').default

module.exports = createReactClass
  displayName: 'CropTask'

  statics:
    Editor: GenericEditor
    Summary: Summary
    AnnotationRenderer: SVGRenderer

    getSVGProps: ({task, workflow, annotation, annotations}) ->
      svgProps = 
        if task?.type is 'crop'
          style:
            pointerEvents: 'all'
        else
          {}

      tasks = require('../index').default
      [previousCropAnnotation] = annotations.filter (anAnnotation) =>
        taskDescription = workflow.tasks[anAnnotation.task]
        TaskComponent = tasks[taskDescription.type]
        TaskComponent is this and anAnnotation.value? and anAnnotation isnt annotation
      if previousCropAnnotation?
        {x, y, width, height} = previousCropAnnotation.value
        svgProps.viewBox = "#{x} #{y} #{width} #{height}"
      svgProps

    InsideSubject: CropInitializer

    getDefaultTask: ->
      type: 'crop'
      instruction: 'Drag to select the relevant area.'
      help: ''

    getTaskText: (task) ->
      task.instruction

    getDefaultAnnotation: ->
      value: null

    isAnnotationComplete: (task, annotation) ->
      annotation.value? or not task.required

  getDefaultProps: ->
    task:
      instruction: ''
    annotation:
      value: null
    onChange: Function.prototype

  render: ->
    # The actual value is updated in the Initializer.
    <GenericTask
      question={@props.translation.instruction}
      help={@props.translation.help}
      required={@props.task.required}
      showRequiredNotice={@props.showRequiredNotice}
    >
      <p>
        <button type="button" className="minor-button" disabled={not @props.annotation.value?} onClick={@handleClear}>Clear current crop</button>
      </p>
    </GenericTask>

  handleClear: ->
    newAnnotation = Object.assign {}, @props.annotation, value: null
    @props.onChange newAnnotation
