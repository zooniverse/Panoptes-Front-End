React = require 'react'
DrawingToolRoot = require './root'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'

MINIMUM_SIZE = 5
DELETE_BUTTON_DISTANCE = 9 / 10
DEFAULT_WIDTH = 25
MINIMUM_WIDTH = 25

module.exports = React.createClass
  displayName: 'RectangleTool'

  statics:
    initCoords: null

    defaultValues: ({x, y}) ->
      x: x
      y: 0
      width: DEFAULT_WIDTH

    initStart: ({x, y}, mark) ->
      @initCoords = {x, 0}
      {x, 0, _inProgress: true}

    initMove: (cursor, mark) ->
      if cursor.x > @initCoords.x
        width = cursor.x - mark.x
        x = mark.x
      else
        width = @initCoords.x - cursor.x
        x = cursor.x

      y = mark.y

      {x, y, width}

    initRelease: ->
      _inProgress: false

    initValid: (mark) ->
      mark.width > MINIMUM_SIZE

  initCoords: null

  render: ->
    {x, y, width} = @props.mark

    <DrawingToolRoot tool={this}>
      <Draggable onDrag={@handleMainDrag} disabled={@props.disabled}>
        <rect x={x} y={y} width={width} height={@props.containerRect.height} />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={x + width + 15} y={y + 10} />

          <DragHandle x={x} y={@props.containerRect.height / 2} scale={@props.scale} onDrag={@handleLeftDrag} onEnd={@normalizeMark} />
          <DragHandle x={x + width} y={@props.containerRect.height / 2} scale={@props.scale} onDrag={@handleRightDrag} onEnd={@normalizeMark} />
        </g>}
    </DrawingToolRoot>

  handleMainDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    # @props.mark.y += d.y / @props.scale.vertical
    @props.onChange @props.mark

  handleLeftDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    # @props.mark.y += d.y / @props.scale.vertical
    @props.mark.width -= d.x / @props.scale.horizontal
    @props.mark.height -= d.y / @props.scale.vertical
    @props.onChange @props.mark

  handleRightDrag: (e, d) ->
    # @props.mark.y += d.y / @props.scale.vertical
    @props.mark.width += d.x / @props.scale.horizontal
    @props.mark.height -= d.y / @props.scale.vertical
    @props.onChange @props.mark

  normalizeMark: ->
    if @props.mark.width < 0
      @props.mark.x += @props.mark.width
      @props.mark.width *= -1

    if @props.mark.height < 0
      @props.mark.y += @props.mark.height
      @props.mark.height *= -1

    @props.onChange @props.mark
