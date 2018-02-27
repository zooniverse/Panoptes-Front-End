React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require './root'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

MINIMUM_SIZE = 5
GUIDE_WIDTH = 1
GUIDE_DASH = [4, 4]
DELETE_BUTTON_WIDTH = 8
BUFFER = 16

module.exports = createReactClass
  displayName: 'RotateRectangleTool'

  statics:
    initCoords: null

    defaultValues: ({x, y}) ->
      x: x
      y: y
      width: 0
      height: 0
      angle: 0

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

    getAngle: (x_center, y_center, x, y) ->
      deltaX = x - x_center
      deltaY = y - y_center
      Math.atan2(deltaY, deltaX) * (180 / Math.PI)

    rotateXY: (x, y, angle) ->
      theta = angle * (Math.PI / 180)
      x_theta = (x * Math.cos(theta)) + (y * Math.sin(theta))
      y_theta = -(x * Math.sin(theta)) + (y * Math.cos(theta))
      {x: x_theta, y: y_theta}

  initCoords: null

  render: ->
    {x, y, width, height, angle} = @props.mark
    x_center = (0.5 * width)
    y_center = (0.5 * height)

    deletePosition = @getDeletePosition(0, width)

    positionAndRotate = "
      translate(#{x} #{y})
      rotate(#{angle} #{x_center} #{y_center})
    "

    <DrawingToolRoot tool={this} transform={positionAndRotate}>
      {if @props.selected
        guideWidth = GUIDE_WIDTH / ((@props.scale.horizontal + @props.scale.vertical) / 2)
        x2 = width + (3 * BUFFER / @props.scale.horizontal)
        <g>
          <line x1={x_center} y1={y_center} x2={x2} y2={y_center} strokeWidth={guideWidth} strokeDasharray={GUIDE_DASH} />
        </g>}

      <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <rect
          width={width}
          height={height}
        />
      </Draggable>

      {if @props.selected
        x_rot = width + (3 * BUFFER / @props.scale.horizontal)
        y_rot = (0.5 *  height)
        <g>
          <DeleteButton tool={this} x={deletePosition.x} y={0} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />

          <DragHandle x={0} y={0} scale={@props.scale} onDrag={@handleTopLeftDrag} onEnd={@normalizeMark} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={width} y={0} scale={@props.scale} onDrag={@handleTopRightDrag} onEnd={@normalizeMark} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={width} y={height} scale={@props.scale} onDrag={@handleBottomRightDrag} onEnd={@normalizeMark} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={0} y={height} scale={@props.scale} onDrag={@handleBottomLeftDrag} onEnd={@normalizeMark} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={x_rot} y={y_rot} scale={@props.scale} onDrag={@handleRotate} onEnd={@normalizeMark} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
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

  handleRotate: (e, d) ->
    {x, y} = @props.getEventOffset e
    x_center = @props.mark.x + (0.5 * @props.mark.width)
    y_center = @props.mark.y + (0.5 * @props.mark.height)
    angle = @constructor.getAngle x_center, y_center, x, y
    @props.mark.angle = angle
    @props.onChange @props.mark

  normalizeMark: ->
    if @props.mark.width < 0
      @props.mark.x += @props.mark.width
      @props.mark.width *= -1

    if @props.mark.height < 0
      @props.mark.y += @props.mark.height
      @props.mark.height *= -1

    @props.onChange @props.mark
