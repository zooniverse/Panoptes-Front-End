# @cjsx React.DOM

React = require 'react'
Draggable = require '../../lib/draggable'

class Point
  constructor: ({@x, @y}) ->

  initStart: ->
    @initMove arguments...

  initMove: ({x, y}) ->
    @x = Math.max 0, x
    @y = Math.max 0, y

module.exports = React.createClass
  displayName: 'PointTool'

  statics:
    MarkClass: Point

  render: ->
    radius = if @props.selected
      10
    else
      5

    transform = "
      translate(#{@props.mark.x}, #{@props.mark.y})
      scale(#{1 / @props.scale.horizontal}, #{1 / @props.scale.vertical})
    "

    color = @props.mark._tool.color ? 'currentcolor'

    <Draggable onStart={@props.select} onDrag={@handleDrag}>
      <g className="point drawing-tool" transform={transform}>
        <circle className="point-tool-disc" r={radius} fill={color} fillOpacity="0.5" stroke={color} />
      </g>
    </Draggable>

  handleDrag: (e) ->
    {x, y} = @props.getEventOffset e
    @props.mark.x = x
    @props.mark.y = y
