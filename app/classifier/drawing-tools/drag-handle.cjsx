React = require 'react'
Draggable = require '../../lib/draggable'

RADIUS = 4
OVERSHOOT = 4

module.exports = React.createClass
  displayName: 'DragHandle'

  render: ->
    style =
      fill: 'currentColor'
      stroke: 'transparent'
      strokeWidth: OVERSHOOT

    <Draggable onStart={@props.onStart} onDrag={@props.onDrag} onEnd={@props.onEnd}>
      <circle className="drag-handle" r={RADIUS} cx={@props.x} cy={@props.y} {...style} />
    </Draggable>
