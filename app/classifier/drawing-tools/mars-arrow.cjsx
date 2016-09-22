React = require 'react'
DrawingToolRoot = require './root'
Draggable = require '../../lib/draggable'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
DragHandle = require './drag-handle'

MINIMUM_LENGTH = 5
GRAB_STROKE_WIDTH = 6
CIRCLE_RADIUS = 10
DELETE_TOOL_PERPENDICULAR_OFFSET = 15

module.exports = React.createClass
  displayName: 'MarsArrowTool'

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

  render: ->
    positionAndRotate = "
      translate(#{@props.mark.x}, #{@props.mark.y})
      rotate(#{-1 * @props.mark.angle})
    "

    scaleFactor = (@props.scale.horizontal + @props.scale.vertical) / 2

    {x1, y1, x2, y2} = @props.mark
    linepoints = {x1, y1, x2, y2}
    arrowheight = 5*Math.sqrt(3.0) / scaleFactor
    arrowwidth = 5 / scaleFactor
    linelength = DrawingToolRoot.distance(x1, y1, x2, y2)

    lineparaunit = if linelength > 0
      [(x2 - x1)/linelength, (y2-y1)/linelength]
    else
      [1, 0]

    drawcircle = linelength*scaleFactor > (CIRCLE_RADIUS + 10)

    circleOpacity = if drawcircle
      1
    else
      0

    linemidpoint = if drawcircle
      [0.5*(x1+x2), 0.5*(y1+y2)]
    else
      [x1, x2]

    lineperpunit = [-lineparaunit[1], lineparaunit[0]]
    headpointsarray = [
        {x: x2, y: y2},
        {x: x2 - arrowheight*lineparaunit[0] + arrowwidth*lineperpunit[0], y: y2 - arrowheight*lineparaunit[1] + arrowwidth*lineperpunit[1]},
        {x: x2 - arrowheight*lineparaunit[0] - arrowwidth*lineperpunit[0], y: y2 - arrowheight*lineparaunit[1] - arrowwidth*lineperpunit[1]},
        {x: x2, y: y2}
      ]
    headpoints = ([x, y].join ',' for {x, y} in headpointsarray)
    headpoints = headpoints.join '\n'

    deleteButtonPostion = { x: headpointsarray[0].x + DELETE_TOOL_PERPENDICULAR_OFFSET*lineperpunit[0]/scaleFactor,
    y: headpointsarray[0].y + DELETE_TOOL_PERPENDICULAR_OFFSET*lineperpunit[1]/scaleFactor}

    <DrawingToolRoot tool={this} transform={positionAndRotate}>
      <line {...linepoints} />
      <polyline points={headpoints} closed={true} fill='currentColor' />
      <circle cx={linemidpoint[0]} cy={linemidpoint[1]} r={CIRCLE_RADIUS / scaleFactor} strokeOpacity={circleOpacity} />

      <Draggable onDrag={@handleStrokeDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <line {...linepoints} strokeWidth={GRAB_STROKE_WIDTH / ((@props.scale.horizontal + @props.scale.vertical) / 2)} strokeOpacity="0" />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={deleteButtonPostion.x} y={deleteButtonPostion.y} />
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
