React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
{svgPathProperties} = require 'svg-path-properties'
{createPathFromCoords, filterDupeCoords, roundCoords} = require './freehand-helpers'

BUFFER = 16
DELETE_BUTTON_WIDTH = 8
MINIMUM_LENGTH = 5

module.exports = createReactClass
  displayName: 'FreehandShapeTool'

  statics:
    defaultValues: ->
      points: []
      _inProgress: false

    initStart: (coords, mark) ->
      mark.points.push roundCoords coords
      _inProgress: true

    initMove: (coords, mark) ->
      mark.points.push roundCoords coords

    initRelease: (coords, mark) ->
      mark.points.push mark.points[0]
      mark.points = filterDupeCoords mark.points
      _inProgress: false

    initValid: (mark) ->
      path = createPathFromCoords mark.points
      properties = svgPathProperties path
      properties.getTotalLength() > MINIMUM_LENGTH

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
    fill = if _inProgress then 'none' else @props.color
    lineClass = if _inProgress then 'drawing' else 'clickable'

    <DrawingToolRoot tool={this}>
      <path d={path}
        fill={fill}
        fillOpacity="0.2"
        className={lineClass} />

      {if !_inProgress and @props.selected
        deletePosition = @getDeletePosition points
        <g>
          <DeleteButton tool={this}
            x={deletePosition.x}
            y={deletePosition.y}
            getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>
