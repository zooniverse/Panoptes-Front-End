React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
{svgPathProperties} = require 'svg-path-properties'
{createPathFromCoords, filterDupeCoords, roundCoords} = require './freehand-helpers'

BUFFER = 16
DELETE_BUTTON_WIDTH = 8
GRAB_STROKE_WIDTH = 6
MINIMUM_LENGTH = 20
SELECTED_STROKE_WIDTH = 6
STROKE_WIDTH =

module.exports = createReactClass
  displayName: 'FreehandLineTool'

  statics:
    defaultValues: ->
      points: []
      _inProgress: false

    initStart: (coords, mark) ->
      points = mark.points.slice()
      points.push roundCoords coords
      _inProgress = true
      { _inProgress, points }

    initMove: (coords, mark) ->
      points = mark.points.slice()
      points.push roundCoords coords
      { points }

    initRelease: (coords, mark) ->
      points: filterDupeCoords mark.points
      _inProgress: false

    initValid: (mark) ->
      path = createPathFromCoords mark.points
      properties = svgPathProperties path
      properties?.getTotalLength() > MINIMUM_LENGTH

  getDeletePosition: ([startCoords, otherCoords...]) ->
    scale = (@props.scale.horizontal + @props.scale.vertical) / 2
    mod = (BUFFER / scale)
    x = startCoords.x - mod
    x: if not @outOfBounds(x, scale) then x else startCoords.x + mod
    y: startCoords.y

  outOfBounds: (deleteBtnX, scale) ->
    deleteBtnX - (DELETE_BUTTON_WIDTH / scale) < 0

  render: ->
    {_inProgress, points} = @props.mark
    path = createPathFromCoords points

    lineClass = if _inProgress then 'drawing' else 'clickable'

    # Setting the pointerEvents prop stops the shape from acting like a closed
    # path for click events
    <DrawingToolRoot tool={this} pointerEvents="visibleStroke">
      <path d={path}
        strokeWidth={GRAB_STROKE_WIDTH / ((@props.scale.horizontal + @props.scale.vertical) / 2)}
        strokeOpacity="0"
        fill="none"
        className={lineClass} />
      <path d={path}
        fill="none"
        className={lineClass} />

      {if @props.selected
        deletePosition = @getDeletePosition points
        <g pointerEvents="fill">
          <DeleteButton tool={this}
            x={deletePosition.x}
            y={deletePosition.y}
            getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>
