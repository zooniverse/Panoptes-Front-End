React = require 'react'
DrawingToolRoot = require './root'
Draggable = require '../../lib/draggable'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
DragHandle = require './drag-handle'

MINIMUM_LENGTH = 5
GRAB_STROKE_WIDTH = 6
BUFFER = 44

module.exports = React.createClass
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
    x = (x1 + x2) / 2
    y = (y1 + y2) / 2
    if @calculateDistance(x, x1, y, y1) is 'x'
      x += BUFFER
    else if @calculateDistance(x, x1, y, y1) is 'y'
      y += BUFFER
    x: x
    y: y

  calculateDistance: (deleteBtnX, handleBtnX, deleteBtnY, handleBtnY) ->
    xDistance = Math.abs(deleteBtnX - handleBtnX)
    yDistance = Math.abs(deleteBtnY - handleBtnY)
    if xDistance < BUFFER and yDistance < BUFFER
      if yDistance >= xDistance
        'x'
      else if xDistance >= yDistance
        'y'

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
          <DeleteButton tool={this} x={deletePosition.x} y={deletePosition.y} />
          <DragHandle x={x1} y={y1} scale={@props.scale} onDrag={@handleHandleDrag.bind this, 1} />
          <DragHandle x={x2} y={y2} scale={@props.scale} onDrag={@handleHandleDrag.bind this, 2} />
        </g>}
    </DrawingToolRoot>

  handleStrokeDrag: (e, d) ->
    for n in [1..2]
      @props.mark["x#{n}"] += d.x / @props.scale.horizontal
      @props.mark["y#{n}"] += d.y / @props.scale.vertical
    @props.onChange @props.mark

  handleHandleDrag: (n, e, d) ->
    @props.mark["x#{n}"] += d.x / @props.scale.horizontal
    @props.mark["y#{n}"] += d.y / @props.scale.vertical
    @props.onChange @props.mark
