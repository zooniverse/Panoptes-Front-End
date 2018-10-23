React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
DragHandle = require './drag-handle'
Draggable = require('../../lib/draggable').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

FINISHER_RADIUS = 8
GRAB_STROKE_WIDTH = 6
GUIDE_WIDTH = 1
GUIDE_DASH = [4, 4]
# fraction of line lenght along (x) and perpendicular (y) to the line to place control point
DEFAULT_CURVE = {x: 0.5, y: 0}
BUFFER = 16

DELETE_BUTTON_WEIGHT = 0.75 # fraction of line lenght to place delete button

module.exports = createReactClass
  displayName: 'BezierCurveTool'

  statics:
    initCoords: null

    defaultValues: ({x, y}) ->
      points: []
      closed: false

    initStart: (newPoint, mark) ->
      if mark.points.length > 0
        lastEnd = mark.points[-1..][0]
        controlPoint = @toImageFrame(lastEnd, newPoint, DEFAULT_CURVE)
        mark.points.push controlPoint
      mark.points.push newPoint
      points: mark.points

    initMove: ({x, y}, mark) ->
      mark.points[mark.points.length - 1] = {x, y}
      points: mark.points

    isComplete: (mark) ->
      mark.closed

    forceComplete: (mark) ->
      mark.closed = true
      mark.auto_closed = true

    toLineFrame: (start, end, control) ->
      # Move the contorl point to a local frame
      # where the line is on the x-axis and has length 1
      dx = end.x - start.x
      dy = end.y - start.y
      dcx = control.x - start.x
      dcy = control.y - start.y
      con = 1 / ((dx * dx) + (dy * dy))
      x: ((dx * dcx) + (dy * dcy)) * con
      y: (-(dy * dcx) + (dx * dcy)) * con

    toImageFrame: (start, end, control) ->
      # Take a control point in the line frame
      # and move it to the image frame
      dx = end.x - start.x
      dy = end.y - start.y
      x: (dx * control.x) - (dy * control.y) + start.x
      y: (dy * control.x) + (dx * control.y) + start.y

  positionAlongCurve: (start, end, control, t) ->
    # t is how far along the curve you want the pont
    # t is in the range [0,1]
    # if control is undefined just return the point t along the line between start and end
    if control?
      buffer = BUFFER / @props.scale.horizontal
      x = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * control.x + t * t * end.x
      y = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * control.y + t * t * end.y
      for point in @props.mark.points
        x = point.x - buffer if @calculateDistance(x, point.x, y, point.y) < buffer
      x: x
      y: y
    else
      x: (1 - t) * start.x + t * end.x
      y: (1 - t) * start.y + t * end.y

  componentWillMount: ->
    @setState
      mouseX: @props.mark.points[0].x
      mouseY: @props.mark.points[0].y
      mouseWithinViewer: true

  componentDidMount: ->
    document.addEventListener 'mousemove', @handleMouseMove

  componentWillUnmount: ->
    document.removeEventListener 'mousemove', @handleMouseMove

  calculateDistance: (deleteBtnX, handleBtnX, deleteBtnY, handleBtnY) ->
    Math.sqrt(Math.pow(deleteBtnX - handleBtnX, 2) + Math.pow(deleteBtnY - handleBtnY, 2))

  render: ->
    {points} = @props.mark
    averageScale = (@props.scale.horizontal + @props.scale.vertical) / 2
    finisherRadius = FINISHER_RADIUS / averageScale
    guideWidth = GUIDE_WIDTH / averageScale

    firstPoint = points[0]
    firstControlPoint = points[1]
    secondPoint = points[2]
    secondPoint ?=
      x: firstPoint.x + (finisherRadius * 2)
      y: firstPoint.y - (finisherRadius * 2)
    lastPoint = points[points.length - 1]

    deleteButtonPosition =
      @positionAlongCurve(firstPoint, secondPoint, firstControlPoint , DELETE_BUTTON_WEIGHT)

    svgPath = "M#{firstPoint.x} #{firstPoint.y} "
    svgPathHelpers = "M#{firstPoint.x} #{firstPoint.y} "
    if points.length > 1
      for idx in [1..points.length-1] by 2
        if points[idx+1]?
          svgPath += "Q #{points[idx].x} #{points[idx].y} #{points[idx+1].x} #{points[idx+1].y} "
          svgPathHelpers += "L #{points[idx].x} #{points[idx].y} L #{points[idx+1].x} #{points[idx+1].y} "
        else
          svgPath += "Q #{lastPoint.x} #{lastPoint.y} #{firstPoint.x} #{firstPoint.y}"
          svgPathHelpers += "L #{lastPoint.x} #{lastPoint.y} L #{firstPoint.x} #{firstPoint.y}"
    if not @props.mark.closed and @state.mouseWithinViewer and points.length
      lastEnd = lastPoint
      controlPointPrime = DEFAULT_CURVE
      newPoint ={x: @state.mouseX, y: @state.mouseY}
      controlPoint = @constructor.toImageFrame(lastEnd, newPoint, controlPointPrime)
      svgPathGuide = "M#{lastEnd.x} #{lastEnd.y} Q #{controlPoint.x} #{controlPoint.y} #{newPoint.x} #{newPoint.y}"

    <DrawingToolRoot tool={this}>
      <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <path d={svgPath} fill={'none' unless @props.mark.closed} />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={deleteButtonPosition.x} y={deleteButtonPosition.y} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <path d={svgPathHelpers} strokeWidth={guideWidth} strokeDasharray={GUIDE_DASH} fill={'none'} />

          {if not @props.mark.closed and points.length and @state.mouseWithinViewer
            <path className="guideline" d={svgPathGuide} fill={'none'} />}

          {if not @props.mark.closed and @props.mark.points.length > 2
            <line className="guideline" x1={lastPoint.x} y1={lastPoint.y} x2={firstPoint.x} y2={firstPoint.y} />}

          {for point, i in points
            if i%2 != 0
              className = "open-drag-handle"
            else
              className = undefined
            <DragHandle className={className} key={i} x={point.x} y={point.y} scale={@props.scale} onDrag={@handleHandleDrag.bind this, i} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />}

          {unless @props.mark.closed
            <g>
              <circle className="clickable" r={finisherRadius} cx={firstPoint.x} cy={firstPoint.y} stroke="transparent" onClick={@handleFinishClick} />
            </g>}
        </g>}
    </DrawingToolRoot>

  handleMouseMove: (e) ->
    newCoord = @props.getEventOffset(e)

    mouseWithinViewer = if e.pageX < @props.containerRect.left || e.pageX > @props.containerRect.right
      false
    else if e.pageY < @props.containerRect.top || e.pageY > @props.containerRect.bottom
      false
    else
      true

    @setState
      mouseX: newCoord.x
      mouseY: newCoord.y
      mouseWithinViewer: mouseWithinViewer

  handleFinishClick: ->
    firstPoint = @props.mark.points[0]
    [lastStart, lastControl, lastEnd] = @props.mark.points[-3..]
    controlPointPrime = DEFAULT_CURVE
    controlPoint = @constructor.toImageFrame(lastEnd, firstPoint, controlPointPrime)
    @props.mark.points.push controlPoint
    document.removeEventListener 'mousemove', @handleMouseMove

    @props.mark.closed = true
    @props.onChange @props.mark

  handleMainDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    for point in @props.mark.points
      point.x += difference.x
      point.y += difference.y
    @props.onChange @props.mark

  handleHandleDrag: (index, e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.points[index].x += difference.x
    @props.mark.points[index].y += difference.y
    @props.onChange @props.mark
