React = require 'react'
Draggable = require '../../lib/draggable'
DragHandle = require '../drawing-tools/drag-handle'

CropInitializer = React.createClass
  render: ->
    <g>
      <Draggable onStart={@handleStart} onDrag={@handleDrag}>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0.2)" stroke="0"></rect>
      </Draggable>
      {if @props.annotation.value?
        {x, y, width, height} = @props.annotation.value
        <g fill="rgba(0, 0, 0, 0.5)" stroke="none" style={pointerEvents: 'none'}>
          <rect x="0" y="0" width={x} height="100%"></rect>
          <rect x={x + width} y="0" width={@props.containerRect.width - (x + width)} height="100%"></rect>
          <rect x={x} y="0" width={width} height={y}></rect>
          <rect x={x} y={y + height} width={width} height={@props.containerRect.height - (y + height)}></rect>
        </g>}
        <rect x={x} y={y} width={width} height={height} fill="none" stroke="black" strokeWidth="1"></rect>
        <g style={color: 'white'}>
          <DragHandle x={x} y={y} scale={@props.scale} />
          <DragHandle x={x + (width / 2)} y={y} scale={@props.scale} />
          <DragHandle x={x + width} y={y} scale={@props.scale} />
          <DragHandle x={x + width} y={y + (height / 2)} scale={@props.scale} />
          <DragHandle x={x + width} y={y + height} scale={@props.scale} />
          <DragHandle x={x + (width / 2)} y={y + height} scale={@props.scale} />
          <DragHandle x={x} y={y + height} scale={@props.scale} />
          <DragHandle x={x} y={y + (height / 2)} scale={@props.scale} />
        </g>
    </g>

  handleStart: (e) ->
    {x, y} = @props.getEventOffset e
    @props.annotation.value = {x, y, width: 0, height: 0}
    @props.classification.update 'annotation'

  handleDrag: (e) ->
    {x, y} = @props.getEventOffset e
    width = x - @props.annotation.value.x
    height = y - @props.annotation.value.y
    @props.annotation.value.width = width
    @props.annotation.value.height = height
    @props.classification.update 'annotation'

module.exports = React.createClass
  displayName: 'SingleChoiceTask'

  statics:
    getSVGProps: ({workflow, classification, annotation}) ->
      tasks = require './index'
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
