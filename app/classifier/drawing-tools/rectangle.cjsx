React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
DragHandle = require './drag-handle'
Draggable = require('../../lib/draggable').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

MINIMUM_SIZE = 5
DELETE_BUTTON_WIDTH = 8
BUFFER = 16

module.exports = createReactClass
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
      {x, y, _inProgress: true}

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

    initRelease: ->
      _inProgress: false

    initValid: (mark) ->
      mark.width > MINIMUM_SIZE and mark.height > MINIMUM_SIZE

  initCoords: null

  render: ->
    {x, y, width, height} = @props.mark

    deletePosition = @getDeletePosition(x, width)

    points = [
      [x, y].join ','
      [x + width, y].join ','
      [x + width, y + height].join ','
      [x, y + height].join ','
      [x, y].join ','
    ].join '\n'

    <DrawingToolRoot tool={this}>
      <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <polyline points={points} />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={deletePosition.x} y={y} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />

          <DragHandle x={x} y={y} scale={@props.scale} onDrag={@handleTopLeftDrag} onEnd={@normalizeMark} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={x + width} y={y} scale={@props.scale} onDrag={@handleTopRightDrag} onEnd={@normalizeMark} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={x +  width} y={y + height} scale={@props.scale} onDrag={@handleBottomRightDrag} onEnd={@normalizeMark} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={x} y={y + height} scale={@props.scale} onDrag={@handleBottomLeftDrag} onEnd={@normalizeMark} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>

  getDeletePosition: (x, width) ->
    scale = @props.scale.horizontal
    x += width + (BUFFER / scale)
    if (@props.containerRect.width / scale) < x + (DELETE_BUTTON_WIDTH / scale)
      x -= (BUFFER / scale) * 2
    x: x

  handleMainDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.x += difference.x
    @props.mark.y += difference.y
    @props.onChange @props.mark

  handleTopLeftDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.x += difference.x
    @props.mark.y += difference.y
    @props.mark.width -= difference.x
    @props.mark.height -= difference.y
    @props.onChange @props.mark

  handleTopRightDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.y += difference.y
    @props.mark.width += difference.x
    @props.mark.height -= difference.y
    @props.onChange @props.mark

  handleBottomRightDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.width += difference.x
    @props.mark.height += difference.y
    @props.onChange @props.mark

  handleBottomLeftDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.x += difference.x
    @props.mark.width -= difference.x
    @props.mark.height += difference.y
    @props.onChange @props.mark

  normalizeMark: ->
    if @props.mark.width < 0
      @props.mark.x += @props.mark.width
      @props.mark.width *= -1

    if @props.mark.height < 0
      @props.mark.y += @props.mark.height
      @props.mark.height *= -1

    @props.onChange @props.mark
