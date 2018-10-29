React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
DragHandle = require './drag-handle'
Draggable = require('../../lib/draggable').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

FINISHER_RADIUS = 8
GRAB_STROKE_WIDTH = 6
BUFFER = 16

DELETE_BUTTON_WEIGHT = 5 # Weight of the second point.

module.exports = createReactClass
  displayName: 'PolygonTool'

  statics:
    initCoords: null

    defaultValues: ({x, y}) ->
      points: []
      closed: false

    initStart: ({x, y}, mark) ->
      mark.points.push {x, y}
      points: mark.points
      _inProgress: true

    initMove: ({x, y}, mark) ->
      mark.points[mark.points.length - 1] = {x, y}
      points: mark.points

    isComplete: (mark) ->
      mark.closed

    forceComplete: (mark) ->
      mark.closed = true
      mark.auto_closed = true

  componentWillMount: ->
    @setState
      mouseX: @props.mark.points[0].x
      mouseY: @props.mark.points[0].y
      mouseWithinViewer: true

  componentDidMount: ->
    document.addEventListener 'mousemove', @handleMouseMove

  componentWillUnmount: ->
    document.removeEventListener 'mousemove', @handleMouseMove

  render: ->
    averageScale = (@props.scale.horizontal + @props.scale.vertical) / 2
    finisherRadius = FINISHER_RADIUS / averageScale

    firstPoint = @props.mark.points[0]
    secondPoint = @props.mark.points[1]
    secondPoint ?=
      x: firstPoint.x + (finisherRadius * 2)
      y: firstPoint.y - (finisherRadius * 2)
    lastPoint = @props.mark.points[@props.mark.points.length - 1]

    points = ([x, y].join ',' for {x, y} in @props.mark.points)
    if @props.mark.closed
      points.push [firstPoint.x, firstPoint.y].join ','
    points = points.join '\n'

    deleteButtonPosition = @getDeletePosition(firstPoint, secondPoint)
    pointerEvents = if @props.disabled then 'none' else 'painted'

    <DrawingToolRoot tool={this} pointerEvents={pointerEvents}>
      <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <polyline  points={points} fill={'none' unless @props.mark.closed} />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={deleteButtonPosition.x} y={deleteButtonPosition.y} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />

          {if not @props.mark.closed and @props.mark.points.length and @state.mouseWithinViewer
            <line className="guideline" x1={lastPoint.x} y1={lastPoint.y} x2={@state.mouseX} y2={@state.mouseY} />}

          {if not @props.mark.closed and @props.mark.points.length > 2
            <line className="guideline" x1={lastPoint.x} y1={lastPoint.y} x2={firstPoint.x} y2={firstPoint.y} />}

          {for point, i in @props.mark.points
            <DragHandle key={i} x={point.x} y={point.y} scale={@props.scale} onDrag={@handleHandleDrag.bind this, i} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />}

          {unless @props.mark.closed
            <g>
              <circle className="clickable" r={finisherRadius} cx={firstPoint.x} cy={firstPoint.y} stroke="transparent" onClick={@handleFinishClick} />
              <circle className="clickable" r={finisherRadius} cx={lastPoint.x} cy={lastPoint.y} onClick={@handleFinishClick} />
            </g>}
        </g>}
    </DrawingToolRoot>

  getDeletePosition: (firstPoint, secondPoint) ->
    buffer = BUFFER / @props.scale.horizontal
    x = (firstPoint.x + ((DELETE_BUTTON_WEIGHT - 1) * secondPoint.x)) / DELETE_BUTTON_WEIGHT
    y = (firstPoint.y + ((DELETE_BUTTON_WEIGHT - 1) * secondPoint.y)) / DELETE_BUTTON_WEIGHT
    for point in @props.mark.points
      x = point.x - buffer if @calculateDistance(x, point.x, y, point.y) < buffer
    x: x
    y: y

  calculateDistance: (deleteBtnX, handleBtnX, deleteBtnY, handleBtnY) ->
    Math.sqrt(Math.pow(deleteBtnX - handleBtnX, 2) + Math.pow(deleteBtnY - handleBtnY, 2))

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
    document.removeEventListener 'mousemove', @handleMouseMove

    @props.mark.closed = true
    @props.mark._inProgress = false
    @props.onChange @props.mark

  handleMainDrag: (e, d) ->
    for point in @props.mark.points
      difference = @props.normalizeDifference(e, d)
      point.x += difference.x
      point.y += difference.y
    @props.onChange @props.mark

  handleHandleDrag: (index, e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.points[index].x += difference.x
    @props.mark.points[index].y += difference.y
    @props.onChange @props.mark
