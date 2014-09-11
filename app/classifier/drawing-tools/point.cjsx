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
    color = @props.mark._tool.color ? 'currentcolor'

    radius = if @props.disabled
      4
    else if @props.selected
      12
    else
      6

    strokeWidth = 3

    transform = "
      translate(#{@props.mark.x}, #{@props.mark.y})
      scale(#{1 / @props.scale.horizontal}, #{1 / @props.scale.vertical})
    "

    <g className="point drawing-tool" transform={transform} data-disabled={@props.disabled || null} data-selected={@props.selected || null}>
      <Draggable onStart={@props.select} onDrag={@handleDrag}>
        <g strokeWidth={strokeWidth}>
          <circle cy="2" r={radius + (strokeWidth / 4)} stroke="black" strokeWidth={strokeWidth * 1.5} opacity="0.3" />
          <circle r={radius + (strokeWidth / 2)} stroke="white" />
          <circle r={radius} fill={if @props.disabled then color else 'transparent'} stroke={color} />
        </g>
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
