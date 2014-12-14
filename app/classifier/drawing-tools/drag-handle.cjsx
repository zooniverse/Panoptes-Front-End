React = require 'react'
Draggable = require '../../lib/draggable'

RADII =
  selected: 4
  normal: 3
  disabled: 2

STROKE_WIDTH = 2

# A consistent drag handle for use across drawing tools.

module.exports = React.createClass
  displayName: 'DragHandle'

  getDefaultProps: ->
    x: 0
    y: 0
    scale:
      horizontal: 1
      vertical: 1
    rotate: 0

  render: ->
    color = @props.color ? 'currentcolor'

    radius = if @props.disabled
      RADII.disabled
    else if @props.selected
      RADII.selected
    else
      RADII.normal

    transform = "
      translate(#{@props.x}, #{@props.y})
      scale(#{1 / @props.scale.horizontal}, #{1 / @props.scale.vertical})
      rotate(#{@props.rotate})
    "

    <Draggable onStart={@props.onStart} onDrag={@props.onDrag} onEnd={@props.onEnd}>
      <g className="drag-handle" strokeWidth={STROKE_WIDTH} transform={transform}>
        <circle className="drag-handle-shadow" cy="2" r={radius + (STROKE_WIDTH / 4)} stroke="black" strokeWidth={STROKE_WIDTH * 1.5} opacity="0.3" />
        <circle className="drag-handle-outline" r={radius + (STROKE_WIDTH / 2)} stroke="white" />
        <circle className="drag-handle-main" r={radius} fill={if @props.disabled then 'transparent' else color} stroke={color} />
      </g>
    </Draggable>
