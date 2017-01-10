React = require 'react'
DrawingToolRoot = require './root'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

MINIMUM_LENGTH = 5
GRAB_STROKE_WIDTH = 6
BUFFER = 16
DELETE_BUTTON_WIDTH = 8

getPathNode = (pathString) ->
  document.querySelectorAll("path[d=\"#{pathString}\"]")[0]

module.exports = React.createClass
  displayName: 'FreehandShapeTool'

  statics:
    initStart: ({x, y}, mark) ->
      _inProgress: true
      path: "M #{x},#{y}"

    initMove: ({x, y}, mark) ->
      path: mark.path + " L #{x},#{y}"

    initRelease: (coords, mark) ->
      path: mark.path + " Z"
      _inProgress: false

    initValid: ({path}) ->
      # This is a static method, so it doesn't have access to the component
      # instance. In order to get the DOM node for the path and get its length, 
      # we need to match the path by the d attribute.
      pathNode = getPathNode path
      pathNode.getTotalLength() > MINIMUM_LENGTH

  getDeletePosition: () ->
    scale = (@props.scale.horizontal + @props.scale.vertical) / 2
    allCoords = @getCoordsFromPathString @props.mark.path
    startCoords = allCoords[0]
    x = startCoords.x - (BUFFER / scale)
    if @outOfBounds(x, scale)
      x = startCoords.x + (BUFFER / scale)
    {x, y: startCoords.y}

  getCoordsFromPathString: (path) ->
    path.split ' '
      .filter (str) -> !/[a-zA-Z]+/.test str
      .map (coordsStr) -> 
        coordsPair = coordsStr.split ','
        x: parseFloat coordsPair[0]
        y: parseFloat coordsPair[1]

  outOfBounds: (deleteBtnX, scale) ->
    deleteBtnX - (DELETE_BUTTON_WIDTH / scale) < 0

  render: ->
    {path, _inProgress} = @props.mark
    fill = if path.slice(-1) is 'Z' then @props.color else 'transparent' 

    <DrawingToolRoot tool={this}>
      <path d={path} fill={fill} fillOpacity="0.2" />

      {if !_inProgress and @props.selected
        deletePosition = @getDeletePosition()
        <g>
          <DeleteButton tool={this} x={deletePosition.x} y={deletePosition.y} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>
