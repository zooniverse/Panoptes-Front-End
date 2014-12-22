React = require 'react'
DrawingToolRoot = require './root'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'
DragHandle = require './drag-handle'

GRAB_STROKE_WIDTH = 6

module.exports = React.createClass
  displayName: 'LineTool'

  statics:
    defaultValues: ({x, y}) ->
      x1: x
      y1: y
      x2: x
      y2: y

    initMove: ({x, y}) ->
      x2: x
      y2: y

  render: ->
    {x1, y1, x2, y2} = @props.mark
    points = {x1, y1, x2, y2}

    <DrawingToolRoot tool={this}>
      <line {...points} />

      <Draggable onStart={@props.select} onDrag={@handleStrokeDrag}>
        <line {...points} strokeWidth={GRAB_STROKE_WIDTH} strokeOpacity="0" />
      </Draggable>

      <DeleteButton tool={this} x={(x1 + x2) / 2} y={(y1 + y2) / 2} />

      {for n in [1..2]
        coords = x: @props.mark["x#{n}"], y: @props.mark["y#{n}"]
        <DragHandle key={n} {...coords} onDrag={@handleHandleDrag.bind this, n} />}
    </DrawingToolRoot>

  handleStrokeDrag: (e, d) ->
    for n in [1..2]
      @props.mark["x#{n}"] += d.x / @props.scale.horizontal
      @props.mark["y#{n}"] += d.y / @props.scale.vertical
    @props.classification.emit 'change'

  handleHandleDrag: (n, e, d) ->
    @props.mark["x#{n}"] += d.x / @props.scale.horizontal
    @props.mark["y#{n}"] += d.y / @props.scale.vertical
    @props.classification.emit 'change'
