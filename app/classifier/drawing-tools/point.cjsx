Model = require '../../lib/model'
React = require 'react'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'
{dispatch} = require '../../lib/dispatcher'

module.exports = React.createClass
  displayName: 'PointTool'

  getInitialState: ->
    destroying: false

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

    <g className="point drawing-tool" transform={transform} data-disabled={@props.disabled || null} data-selected={@props.selected || null} data-destroying={@state.destroying || null}>
      <Draggable onStart={@props.select} onDrag={@handleDrag}>
        <g className="drawing-tool-main" strokeWidth={strokeWidth}>
          <circle cy="2" r={radius + (strokeWidth / 4)} stroke="black" strokeWidth={strokeWidth * 1.5} opacity="0.3" />
          <circle r={radius + (strokeWidth / 2)} stroke="white" />
          <circle r={radius} fill={if @props.disabled then color else 'transparent'} stroke={color} />
        </g>
      </Draggable>

      <DeleteButton x={radius} y={-1 * radius} onClick={@deleteMark} />
    </g>

  handleDrag: (e) ->
    {x, y} = @props.getEventOffset e
    @props.mark.x = x
    @props.mark.y = y
    @props.classification.emit 'change'

  deleteMark: ->
    @setState destroying: true
    setTimeout (=>
      markIndex = @props.annotation.marks.indexOf @props.mark
      @props.annotation.marks.splice markIndex, 1
      @props.classification.emit 'change'), 500
