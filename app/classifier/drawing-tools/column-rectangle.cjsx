React = require 'react'
DrawingToolRoot = require './root'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'

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
      mark.width >= MINIMUM_WIDTH

  initCoords: null

  render: ->
    {x, y, width} = @props.mark
    allowedWidth = if @props.mark.width < MINIMUM_WIDTH then MINIMUM_WIDTH else width
    <DrawingToolRoot tool={this}>
      <Draggable onDrag={@handleMainDrag} disabled={@props.disabled}>
        <rect ref="rect" x={x} y={y} width={allowedWidth} height={@props.containerRect.height / @props.scale.vertical} />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={x + allowedWidth + 20} y={y + 15} />

          <DragHandle x={x} y={(@props.containerRect.height / @props.scale.vertical) / 2} scale={@props.scale} onDrag={@handleLeftDrag} onEnd={@normalizeMark} />
          <DragHandle x={x + allowedWidth} y={(@props.containerRect.height / @props.scale.vertical) / 2} scale={@props.scale} onDrag={@handleRightDrag} onEnd={@normalizeMark} />
        </g>}
    </DrawingToolRoot>

  handleMainDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    @props.onChange @props.mark

  handleLeftDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal if @props.mark.width >= MINIMUM_WIDTH
    @props.mark.width -= d.x / @props.scale.horizontal 
    @props.onChange @props.mark if @props.mark.width >= MINIMUM_WIDTH

  handleRightDrag: (e, d) ->
    @props.mark.width += d.x / @props.scale.horizontal
    @props.onChange @props.mark 

  normalizeMark: ->
    if @props.mark.width < MINIMUM_WIDTH
      @props.mark.x += @props.mark.width if @props.mark.width >= MINIMUM_WIDTH
      @props.mark.width is MINIMUM_WIDTH

    @props.onChange @props.mark if @props.mark.width >= MINIMUM_WIDTH
