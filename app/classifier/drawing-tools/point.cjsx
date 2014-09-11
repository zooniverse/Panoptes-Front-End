# @cjsx React.DOM

React = require 'react'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'

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
    radius = if @props.disabled
      6
    else if @props.selected
      12
    else
      10

    transform = "
      translate(#{@props.mark.x}, #{@props.mark.y})
      scale(#{1 / @props.scale.horizontal}, #{1 / @props.scale.vertical})
    "

    color = @props.mark._tool.color ? 'currentcolor'

    <g className="point drawing-tool" transform={transform} data-disabled={@props.disabled || null} data-selected={@props.selected || null}>
      <Draggable onStart={@props.select} onDrag={@handleDrag}>
        <circle className="main-disc" r={radius} fill={color} stroke={color} />
      </Draggable>

      <DeleteButton transform="translate(#{radius}, #{-1 * radius})" onClick={@deleteMark} />
    </g>

  handleDrag: (e) ->
    unless @props.disabled
      {x, y} = @props.getEventOffset e
      @props.mark.x = x
      @props.mark.y = y

  deleteMark: ->
    console.log 'Delete mark'
