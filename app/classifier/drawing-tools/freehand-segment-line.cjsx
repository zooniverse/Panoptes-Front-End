React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
{createPathFromCoords, filterDupeCoords, roundCoords} = require './freehand-helpers'

BUFFER = 16
DELETE_BUTTON_WIDTH = 8
FINISHER_RADIUS = 8
GRAB_STROKE_WIDTH = 20
MINIMUM_LENGTH = 20
POINT_RADIUS = 4

module.exports = createReactClass
  displayName: 'FreehandSegmentLineTool'

  statics:
    initCoords: null

    defaultValues: ->
      points: []
      _inProgress: false
      _currentlyDrawing: false

    initStart: (coords, mark) ->
      points = mark.points.slice()
      points.push roundCoords coords
      _inProgress = true
      _currentlyDrawing = true
      { _inProgress, _currentlyDrawing, points }

    initMove: (coords, mark) ->
      points = mark.points.slice()
      points.push roundCoords coords
      { points }

    initRelease: (coords, mark) ->
      _currentlyDrawing: false
      points: filterDupeCoords mark.points

    isComplete: (mark) ->
      !mark._inProgress

    forceComplete: (mark) ->
      mark.points = filterDupeCoords mark.points
      mark._inProgress = false
      mark._currentlyDrawing = false
      mark.auto_closed = true

  componentDidMount: ->
    document.addEventListener 'mousemove', @handleMouseMove

  componentWillMount: ->
    @setState
      mouseX: @props.mark.points[0].x
      mouseY: @props.mark.points[0].y
      mouseWithinViewer: true

  componentWillUnmount: ->
    document.removeEventListener 'mousemove', @handleMouseMove

  getDeletePosition: ([startCoords, otherCoords...]) ->
    scale = (@props.scale.horizontal + @props.scale.vertical) / 2
    mod = (BUFFER / scale)
    x = startCoords.x - mod
    x: if not @outOfBounds(x, scale) then x else startCoords.x + mod
    y: startCoords.y

  handleFinishClick: ->
    document.removeEventListener 'mousemove', @handleMouseMove
    @props.mark._inProgress = false
    @props.mark._currentlyDrawing = false
    @props.onChange @props.mark

  handleFinishHover: (e) ->
    if e.type == 'mouseenter'
      @setState lastPointHover: true
    else if e.type == 'mouseleave'
      @setState lastPointHover: false

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

  outOfBounds: (deleteBtnX, scale) ->
    deleteBtnX - (DELETE_BUTTON_WIDTH / scale) < 0

  render: ->
    { _inProgress, _currentlyDrawing, points } = @props.mark
    path = createPathFromCoords points
    lineClass = if _inProgress then 'drawing' else 'clickable clickable-line'
    pointerEvents = if @props.disabled then 'none' else 'painted'

    <DrawingToolRoot
      tool={this}
      pointerEvents={pointerEvents}
    >
      <path d={path}
        fill="none"
        strokeWidth={GRAB_STROKE_WIDTH / ((@props.scale.horizontal + @props.scale.vertical) / 2)}
        stroke="transparent"
        className={lineClass} />
      <path d={path} fill="none" className={lineClass} />

      {if @props.selected
        deletePosition = @getDeletePosition points
        [..., lastPoint] = points

        <g>
          <DeleteButton tool={this}
            x={deletePosition.x}
            y={deletePosition.y}
            getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}

      {if @props.selected and _inProgress and points.length and @state.mouseWithinViewer
        <line className="guideline"
          x1={lastPoint.x}
          y1={lastPoint.y}
          x2={@state.mouseX}
          y2={@state.mouseY} />}

      {if @props.selected and _inProgress and not _currentlyDrawing
        averageScale = (@props.scale.horizontal + @props.scale.vertical) / 2
        <g>
          {if @state.lastPointHover
            <circle r={FINISHER_RADIUS / averageScale} cx={lastPoint.x} cy={lastPoint.y} />}

          <circle className="clickable"
            r={POINT_RADIUS / averageScale}
            cx={lastPoint.x}
            cy={lastPoint.y}
            onClick={@handleFinishClick}
            onMouseEnter={@handleFinishHover}
            onMouseLeave={@handleFinishHover}
            fill="currentColor" />
        </g>}
      }
    </DrawingToolRoot>
