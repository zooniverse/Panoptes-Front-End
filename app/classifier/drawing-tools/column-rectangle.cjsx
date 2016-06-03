React = require 'react'
DrawingToolRoot = require './root'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

DEFAULT_WIDTH = 25
MINIMUM_WIDTH = 25

module.exports = React.createClass
  displayName: 'RectangleTool'

  statics:
    initCoords: null

    defaultValues: ({x}) ->
      x: x
      width: DEFAULT_WIDTH

    initStart: ({x}, mark) ->
      @initCoords = {x, 0}
      {x, 0, _inProgress: true}

    initMove: (cursor, mark) ->
      if cursor.x > @initCoords.x
        width = cursor.x - mark.x
        x = mark.x
      else
        width = @initCoords.x - cursor.x
        x = cursor.x

      {x, width}

    initRelease: ->
      _inProgress: false

    initValid: (mark) ->
      mark.width >= MINIMUM_WIDTH

  initCoords: null

  render: ->
    {x, width} = @props.mark

    <DrawingToolRoot tool={this}>
      <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <rect ref="rect" x={x} y={0} width={width} height={@props.containerRect.height / @props.scale.vertical} />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={x + width + 20} y={15} />

          <DragHandle x={x} y={(@props.containerRect.height / @props.scale.vertical) / 2} scale={@props.scale} onDrag={@handleLeftDrag} />
          <DragHandle x={x + width} y={(@props.containerRect.height / @props.scale.vertical) / 2} scale={@props.scale} onDrag={@handleRightDrag} />
        </g>}
    </DrawingToolRoot>

  handleMainDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    @props.onChange @props.mark

  handleLeftDrag: (e, d) ->
    if @props.mark.width - d.x / @props.scale.horizontal >= MINIMUM_WIDTH
      @props.mark.x += d.x / @props.scale.horizontal
      @props.mark.width -= d.x / @props.scale.horizontal
      @props.onChange @props.mark

  handleRightDrag: (e, d) ->
    if @props.mark.width + d.x / @props.scale.horizontal >= MINIMUM_WIDTH
      @props.mark.width += d.x / @props.scale.horizontal
      @props.onChange @props.mark
