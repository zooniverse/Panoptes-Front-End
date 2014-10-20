# @cjsx React.DOM

Model = require '../../data/model'
React = require 'react'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'
{dispatch} = require '../../lib/dispatcher'

module.exports = React.createClass
  displayName: 'PointTool'

  statics:
    defaultValues: ->
      @initStart arguments...

    initStart: ->
      @initMove arguments...

    initMove: ({x, y}) ->
      {x, y}

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

      <DeleteButton x={radius} y={-1 * radius} onClick={@deleteMark} />
    </g>

  handleDrag: (e) ->
    dispatch 'classification:annotation:mark:update', @props.mark, @props.getEventOffset e

  deleteMark: ->
    dispatch 'classification:annotation:mark:delete', @props.mark
