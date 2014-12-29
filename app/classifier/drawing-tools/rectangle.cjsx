React = require 'react'
DrawingToolRoot = require './root'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'

DELETE_BUTTON_DISTANCE = 9 / 10

module.exports = React.createClass
  displayName: 'RectangleTool'

  statics:
    initCoords: null

    defaultValues: ({x, y}) ->
      x: x
      y: y
      width: 0
      height: 0

    initStart: ({x, y}, mark) ->
      @initCoords = {x, y}
      {x, y}

    initMove: (cursor, mark) ->
      if cursor.x > @initCoords.x
        width = cursor.x - mark.x
        x = mark.x
      else
        width = @initCoords.x - cursor.x
        x = cursor.x

      if cursor.y > @initCoords.y
        height = cursor.y - mark.y
        y = mark.y
      else
        height = @initCoords.y - cursor.y
        y = cursor.y

      {x, y, width, height}

  initCoords: null

  render: ->
    {x, y, width, height} = @props.mark

    points = [
      [x, y].join ','
      [x + width, y].join ','
      [x + width, y + height].join ','
      [x, y + height].join ','
      [x, y].join ','
    ].join '\n'

    <DrawingToolRoot tool={this}>
      <Draggable onStart={@props.select} onDrag={@handleMainDrag}>
        <polyline points={points} />
      </Draggable>

      <DeleteButton tool={this} x={x + (width * DELETE_BUTTON_DISTANCE)} y={y} />

      <DragHandle x={x} y={y} onDrag={@handleTopLeftDrag} onEnd={@normalizeMark} />
      <DragHandle x={x + width} y={y} onDrag={@handleTopRightDrag} onEnd={@normalizeMark} />
      <DragHandle x={x +  width} y={y + height} onDrag={@handleBottomRightDrag} onEnd={@normalizeMark} />
      <DragHandle x={x} y={y + height} onDrag={@handleBottomLeftDrag} onEnd={@normalizeMark} />
    </DrawingToolRoot>

  handleMainDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    @props.mark.y += d.y / @props.scale.vertical
    @props.classification.emit 'change'

  handleTopLeftDrag: (e, d) ->
    @props.mark.x += d.x
    @props.mark.y += d.y
    @props.mark.width -= d.x
    @props.mark.height -= d.y
    @props.classification.emit 'change'

  handleTopRightDrag: (e, d) ->
    @props.mark.y += d.y
    @props.mark.width += d.x
    @props.mark.height -= d.y
    @props.classification.emit 'change'

  handleBottomRightDrag: (e, d) ->
    @props.mark.width += d.x
    @props.mark.height += d.y
    @props.classification.emit 'change'

  handleBottomLeftDrag: (e, d) ->
    @props.mark.x += d.x
    @props.mark.width -= d.x
    @props.mark.height += d.y
    @props.classification.emit 'change'

  normalizeMark: ->
    if @props.mark.width < 0
      @props.mark.x += @props.mark.width
      @props.mark.width *= -1

    if @props.mark.height < 0
      @props.mark.y += @props.mark.height
      @props.mark.height *= -1

    @props.classification.emit 'change'
