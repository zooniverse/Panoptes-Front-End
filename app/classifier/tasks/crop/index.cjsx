React = require 'react'
CropInitializer = require './initializer'

module.exports = React.createClass
  displayName: 'CropTask'

  statics:
    getSVGProps: ({workflow, classification, annotation}) ->
      tasks = require '../index'
      [previousCropAnnotation] = classification.annotations.filter (anAnnotation) =>
        taskDescription = workflow.tasks[anAnnotation.task]
        TaskComponent = tasks[taskDescription.type]
        TaskComponent is this and anAnnotation isnt annotation
      if previousCropAnnotation?
        {x, y, width, height} = previousCropAnnotation.value
        viewBox: "#{x} #{y} #{width} #{height}"

    InsideSubject: CropInitializer

    getDefaultTask: ->
      type: 'crop'
      instruction: 'Crop to the relevant area.'
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
    <div>
      <p>{@props.task.instruction}</p>
      <p>
        <button type="button">Remove current crop</button>
      </p>
    </div>

  handleChange: (index, e) ->
    if e.target.checked
      @props.annotation.value = index
      @props.onChange? e
