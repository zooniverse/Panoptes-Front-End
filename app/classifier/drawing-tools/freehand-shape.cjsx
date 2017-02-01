React = require 'react'
DrawingToolRoot = require './root'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
{svgPathProperties} = require 'svg-path-properties'
{createPathFromCoords} = require './freehand-helpers'

BUFFER = 16
DELETE_BUTTON_WIDTH = 8
MINIMUM_LENGTH = 5

module.exports = React.createClass
  displayName: 'FreehandShapeTool'

  statics:
    defaultValues: ->
      points: []
      _inProgress: false

    initStart: ({x, y}, mark) ->
      mark.points.push {x, y}
      _inProgress: true

    initMove: ({x, y}, mark) ->
      mark.points.push {x, y}

    initRelease: (coords, mark) ->
      mark.points.push mark.points[0]
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

    <DrawingToolRoot tool={this}>
      <path d={path} 
        fill={fill} 
        fillOpacity="0.2" 
        className="clickable" />

      {if !_inProgress and @props.selected
        deletePosition = @getDeletePosition points
        <g>
          <DeleteButton tool={this} 
            x={deletePosition.x} 
            y={deletePosition.y} 
            getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>
