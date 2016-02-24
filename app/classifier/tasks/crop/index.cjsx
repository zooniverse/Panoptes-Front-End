React = require 'react'
CropInitializer = require './initializer'
GenericTask = require '../generic'
GenericEditor = require '../generic-editor'
Summary = require './summary'

module.exports = React.createClass
  displayName: 'CropTask'

  statics:
    Editor: GenericEditor
    Summary: Summary

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

    testAnnotationQuality: (unknown, knownGood) ->
      if unknown.value is null or knownGood.value is null
        if unknown.value is knownGood.value
          1
        else
          0
      else
        unknownX2 = unknown.value.x + unknown.value.width
        unknownY2 = unknown.value.y + unknown.value.height
        knownGoodX2 = knownGood.value.x + knownGood.value.width
        knownGoodY2 = knownGood.value.y + knownGood.value.height
        intersectX = Math.max 0, Math.min(unknownX2, knownGoodX2) - Math.max(unknown.value.x, knownGood.value.x)
        intersectY = Math.max 0, Math.min(unknownY2, knownGoodY2) - Math.max(unknown.value.y, knownGood.value.y)
        intersectArea = intersectX * intersectY
        unknownArea = unknown.value.width * unknown.value.height
        knownGoodArea = knownGood.value.width * knownGood.value.height
        unionArea = (unknownArea + knownGoodArea) - intersectArea
        intersectArea / unionArea

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: Function.prototype

  render: ->
    # The actual value is updated in the Initializer.
    <GenericTask question={@props.task.instruction} help={@props.task.help} required={@props.task.required}>
      <p>
        <button type="button" className="minor-button" disabled={not @props.annotation.value?} onClick={@handleClear}>Clear current crop</button>
      </p>
    </GenericTask>

  handleClear: ->
    newAnnotation = Object.assign {}, @props.annotation, value: null
    @props.onChange newAnnotation
