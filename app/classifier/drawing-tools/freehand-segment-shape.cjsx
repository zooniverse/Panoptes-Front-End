React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
{createPathFromCoords, filterDupeCoords, roundCoords} = require './freehand-helpers'

BUFFER = 16
DELETE_BUTTON_WIDTH = 8
FINISHER_RADIUS = 8
MINIMUM_LENGTH = 20
POINT_RADIUS = 4

module.exports = createReactClass
  displayName: 'FreehandSegmentShapeTool'

  statics:
    initCoords: null

    defaultValues: ->
      points: []
      _inProgress: false
      _currentlyDrawing: false

    initStart: (coords, mark) ->
      mark.points.push roundCoords coords
      _inProgress: true
      _currentlyDrawing: true

    initMove: (coords, mark) ->
      mark.points.push roundCoords coords

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
    @props.mark.points.push @props.mark.points[0]
    @props.mark._inProgress = false
    @props.onChange @props.mark

  handleFinishHover: (e) ->
    if e.type == 'mouseenter'
      @setState firstPointHover: true
    else if e.type == 'mouseleave'
      @setState firstPointHover: false

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
    { _currentlyDrawing, _inProgress, points } = @props.mark
    path = createPathFromCoords points
    fill = if _inProgress then 'none' else @props.color
    lineClass = if _inProgress then 'drawing' else 'clickable'

    <DrawingToolRoot tool={this}>
      <path d={path}
        fill={fill}
        fillOpacity="0.2"
        className={lineClass} />

      {if @props.selected
        [firstPoint, ..., lastPoint] = points
        deletePosition = @getDeletePosition points

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
          {if @state.firstPointHover
            <circle r={FINISHER_RADIUS / averageScale} cx={firstPoint.x} cy={firstPoint.y} />}

          <circle className="clickable"
            r={POINT_RADIUS / averageScale}
            cx={firstPoint.x}
            cy={firstPoint.y}
            onClick={@handleFinishClick}
            onMouseEnter={@handleFinishHover}
            onMouseLeave={@handleFinishHover}
            fill="currentColor" />
        </g>}
      }
    </DrawingToolRoot>
