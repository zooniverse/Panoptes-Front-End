React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
DragHandle = require './drag-handle'
Draggable = require('../../lib/draggable').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

DEFAULT_SQUASH = 1 / 2
MINIMUM_RADIUS = 5
GUIDE_WIDTH = 1
GUIDE_DASH = [4, 4]
DELETE_BUTTON_ANGLE = 45
BUFFER = 16

module.exports = createReactClass
  displayName: 'EllipseTool'

  statics:
    defaultValues: ({x, y}) ->
      x: x
      y: y
      rx: 0
      ry: 0
      angle: 0

    initStart: ->
      _inProgress: true

    initMove: ({x, y}, mark) ->
      distance = @getDistance mark.x, mark.y, x, y
      angle = @getAngle mark.x, mark.y, x, y
      rx: distance
      ry: distance * DEFAULT_SQUASH
      angle: angle

    initRelease: ->
      _inProgress: false

    initValid: (mark) ->
      mark.rx > MINIMUM_RADIUS

    getDistance: (x1, y1, x2, y2) ->
      aSquared = Math.pow x2 - x1, 2
      bSquared = Math.pow y2 - y1, 2
      Math.sqrt aSquared + bSquared

    getAngle: (x1, y1, x2, y2) ->
      deltaX = x2 - x1
      deltaY = y2 - y1
      Math.atan2(deltaY, deltaX) * (-180 / Math.PI)

  getDeletePosition: ->
    theta = (DELETE_BUTTON_ANGLE - @props.mark.angle) * (Math.PI / 180)
    x: (@props.mark.rx + (BUFFER / @props.scale.horizontal)) * Math.cos theta
    y: -1 * (@props.mark.ry + (BUFFER / @props.scale.vertical)) * Math.sin theta

  render: ->
    positionAndRotate = "
      translate(#{@props.mark.x}, #{@props.mark.y})
      rotate(#{-1 * @props.mark.angle})
    "

    deletePosition = @getDeletePosition()

    <DrawingToolRoot tool={this} transform={positionAndRotate}>
      {if @props.selected
        guideWidth = GUIDE_WIDTH / ((@props.scale.horizontal + @props.scale.vertical) / 2)
        <g>
          <line x1="0" y1="0" x2={@props.mark.rx} y2="0" strokeWidth={guideWidth} strokeDasharray={GUIDE_DASH} />
          <line x1="0" y1="0" x2="0" y2={-1 * @props.mark.ry} strokeWidth={guideWidth} strokeDasharray={GUIDE_DASH} />
        </g>}

      <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <ellipse rx={@props.mark.rx} ry={@props.mark.ry} />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={deletePosition.x} y={deletePosition.y} rotate={@props.mark.angle} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle onDrag={@handleRadiusHandleDrag.bind this, 'x'} x={@props.mark.rx} y={0} scale={@props.scale} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle onDrag={@handleRadiusHandleDrag.bind this, 'y'} x={0} y={-1 * @props.mark.ry} scale={@props.scale} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>

  handleMainDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.x += difference.x
    @props.mark.y += difference.y
    @props.onChange @props.mark

  handleRadiusHandleDrag: (coord, e, d) ->
    {x, y} = @props.getEventOffset e
    r = @constructor.getDistance @props.mark.x, @props.mark.y , x, y
    angle = @constructor.getAngle @props.mark.x, @props.mark.y , x, y
    @props.mark["r#{coord}"] = r
    @props.mark.angle = angle
    if coord is 'y'
      @props.mark.angle -= 90
    @props.onChange @props.mark
