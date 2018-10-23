React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default;
DragHandle = require './drag-handle'
Draggable = require('../../lib/draggable').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

MINIMUM_RADIUS = 5
GUIDE_WIDTH = 1
GUIDE_DASH = [4, 4]
DELETE_BUTTON_ANGLE = 45
BUFFER = 16

module.exports = createReactClass
  displayName: 'TriangleTool'

  statics:
    defaultValues: ({x, y}) ->
      x: x
      y: y
      r: 0
      angle: 0

    initStart: ->
      _inProgress: true

    initMove: ({x, y}, mark) ->
      distance = @getDistance mark.x, mark.y, x, y
      angle = @getAngle mark.x, mark.y, x, y
      r: distance
      angle: angle

    initRelease: ->
      _inProgress: false

    initValid: (mark) ->
      mark.r > MINIMUM_RADIUS

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
    x: (@props.mark.r + (BUFFER / @props.scale.horizontal)) * Math.cos theta
    y: -1 * (@props.mark.r + (BUFFER / @props.scale.vertical)) * Math.sin theta

  computePoints: (r) ->
    cx = r 
    cy = r 
    
    ax = cx * Math.cos( 240 )  - ( cy * Math.sin( 240 ) )
    ay = cx * Math.sin( 240 )  + ( cy * Math.cos( 240 ) )
    bx = cx * Math.cos( 120 )  - ( cy * Math.sin( 120 ) )
    _by = cx * Math.sin( 120 ) + ( cy * Math.cos( 120 ) )
    "#{ax},#{ay} #{bx},#{_by} 0,0"
    "0,#{0-r} #{0-(r*Math.sqrt(3)/2)},#{r/2} #{r*Math.sqrt(3)/2},#{r/2}"

  render: ->
    positionAndRotate = "
      translate(#{@props.mark.x}, #{@props.mark.y})
      rotate(#{-1 * @props.mark.angle})
    "

    deletePosition = @getDeletePosition()

    <DrawingToolRoot tool={this} transform={positionAndRotate}>
      {if @props.selected
        <line x1="0" y1="0" x2="0" y2={0-@props.mark.r} strokeWidth={GUIDE_WIDTH / ((@props.scale.horizontal + @props.scale.vertical) / 2)} strokeDasharray={GUIDE_DASH} />}

      <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <polygon points={@computePoints @props.mark.r}/>

      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={deletePosition.x} y={deletePosition.y} rotate={@props.mark.angle} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle onDrag={@handleRadiusHandleDrag} y={0-@props.mark.r} x={0} scale={@props.scale} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>

  handleMainDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.x += difference.x
    @props.mark.y += difference.y
    @props.onChange @props.mark

  handleRadiusHandleDrag: (e, d) ->
    {x, y} = @props.getEventOffset e
    r = @constructor.getDistance @props.mark.x, @props.mark.y , x, y
    angle = @constructor.getAngle @props.mark.x, @props.mark.y , x, y
    @props.mark.r = r
    @props.mark.angle = angle
    @props.onChange @props.mark
