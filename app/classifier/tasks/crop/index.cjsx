React = require 'react'
CropInitializer = require './initializer'
GenericTask = require '../generic'

module.exports = React.createClass
  displayName: 'CropTask'

  statics:
    getSVGProps: ({workflow, classification, annotation}) ->
      tasks = require '../index'
      [previousCropAnnotation] = classification.annotations.filter (anAnnotation) =>
        taskDescription = workflow.tasks[anAnnotation.task]
        TaskComponent = tasks[taskDescription.type]
        TaskComponent is this and anAnnotation.value? and anAnnotation isnt annotation
      if previousCropAnnotation?
        {x, y, width, height} = previousCropAnnotation.value
        viewBox: "#{x} #{y} #{width} #{height}"

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
    task: null
    annotation: null
    onChange: Function.prototype

  render: ->
    <GenericTask question={@props.task.instruction} help={@props.task.help}>
      <p>
        <button type="button" onClick={@handleClear}>Clear current crop</button>
      </p>
    </GenericTask>

  handleClear: ->
    @props.annotation.value = null
    @props.onChange()
