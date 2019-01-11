React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
Draggable = require('../../lib/draggable').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
DragHandle = require './drag-handle'

MINIMUM_LENGTH = 5
GRAB_STROKE_WIDTH = 6
BUFFER = 16
DELETE_BUTTON_WIDTH = 8

module.exports = createReactClass
  displayName: 'LineTool'

  statics:
    defaultValues: ({x, y}) ->
      x1: x
      y1: y
      x2: x
      y2: y

    initStart: ->
      _inProgress: true

    initMove: ({x, y}) ->
      x2: x
      y2: y

    initRelease: ->
      _inProgress: false

    initValid: (mark) ->
      {x1, y1, x2, y2} = mark
      DrawingToolRoot.distance(x1, y1, x2, y2) > MINIMUM_LENGTH

  getDeletePosition: (x1, y1, x2, y2) ->
    scale = (@props.scale.horizontal + @props.scale.vertical) / 2
    x = if x1 > x2 then x1 + (BUFFER / scale) else x1 - (BUFFER / scale)
    if @outOfBounds(x, scale)
      x = (x1 + x2) / 2
      y1 = (y1 + y2) / 2
    x: x
    y: y1

  outOfBounds: (deleteBtnX, scale) ->
    leftSide = deleteBtnX - (DELETE_BUTTON_WIDTH / scale) < 0
    rightSide = (@props.containerRect.width / @props.scale.horizontal) < deleteBtnX + (DELETE_BUTTON_WIDTH / scale)
    leftSide or rightSide

  render: ->
    {x1, y1, x2, y2} = @props.mark
    points = {x1, y1, x2, y2}

    deletePosition = @getDeletePosition(x1, y1, x2, y2)

    <DrawingToolRoot tool={this}>
      <line {...points} />

      <Draggable onDrag={@handleStrokeDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <line {...points} strokeWidth={GRAB_STROKE_WIDTH / ((@props.scale.horizontal + @props.scale.vertical) / 2)} strokeOpacity="0" />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={deletePosition.x} y={deletePosition.y} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={x1} y={y1} scale={@props.scale} onDrag={@handleHandleDrag.bind this, 1} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={x2} y={y2} scale={@props.scale} onDrag={@handleHandleDrag.bind this, 2} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>

  handleStrokeDrag: (e, d) ->
    for n in [1..2]      
      difference = @props.normalizeDifference(e, d)
      @props.mark["x#{n}"] += difference.x
      @props.mark["y#{n}"] += difference.y
    @props.onChange @props.mark

  handleHandleDrag: (n, e, d) ->
    difference = @props.normalizeDifference(e,d)
    @props.mark["x#{n}"] += difference.x
    @props.mark["y#{n}"] += difference.y
    @props.onChange @props.mark
