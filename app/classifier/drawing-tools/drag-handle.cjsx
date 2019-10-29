React = require 'react'
createReactClass = require 'create-react-class'
Draggable = require('../../lib/draggable').default

RADIUS = if screen.width > 900 then 4 else 10
OVERSHOOT = if screen.width > 900 then 4 else 10

module.exports = createReactClass
  displayName: 'DragHandle'

  render: ->
    matrix = @props.getScreenCurrentTransformationMatrix()
    return null unless matrix?
    className = "drag-handle"
    if @props.className?
      className += " #{@props.className}"
    styleProps =
      fill: 'currentColor'
      stroke: 'transparent'
      strokeWidth: OVERSHOOT
      transform: """
        translate(#{@props.x}, #{@props.y})
        matrix( #{1/matrix.a} 0 0 #{1/matrix.d} 0 0)
      """
    <Draggable onStart={@props.onStart} onDrag={@props.onDrag} onEnd={@props.onEnd} >
      <circle className={className} r={RADIUS} {...styleProps} style={@props.style} />
    </Draggable>
