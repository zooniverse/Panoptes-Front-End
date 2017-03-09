React = require 'react'
DrawingToolRoot = require './root'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
{svgPathProperties} = require 'svg-path-properties'
{createPathFromCoords, filterDupeCoords} = require './freehand-helpers'

BUFFER = 16
DELETE_BUTTON_WIDTH = 8
GRAB_STROKE_WIDTH = 6
MINIMUM_LENGTH = 20
SELECTED_STROKE_WIDTH = 6
STROKE_WIDTH =

module.exports = React.createClass
  displayName: 'FreehandLineTool'

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
      points: filterDupeCoords mark.points
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

  handleHover: (e) ->
    if e.type == 'mouseenter'
      @setState hover: true
    else if e.type == 'mouseleave'
      @setState hover: false

  outOfBounds: (deleteBtnX, scale) ->
    deleteBtnX - (DELETE_BUTTON_WIDTH / scale) < 0

  render: ->
    {_inProgress, points} = @props.mark
    path = createPathFromCoords points

    <DrawingToolRoot tool={this}>
      <path d={path}
        strokeWidth={GRAB_STROKE_WIDTH / ((@props.scale.horizontal + @props.scale.vertical) / 2)}
        strokeOpacity="0"
        fill="none"
        className="clickable" />
      <path d={path} fill="none" className="clickable" />

      {if @props.selected
        deletePosition = @getDeletePosition points
        <g>
          <DeleteButton tool={this}
            x={deletePosition.x}
            y={deletePosition.y}
            getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>
