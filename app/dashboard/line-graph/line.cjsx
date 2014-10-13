# @cjsx React.DOM

React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphLine'

  borderWidth: 2
  fill: '#fff'

  circle: (d, i) ->
    <circle
      key={i}
      cx={d.x + "%"}
      cy={d.y + "%"}
      r={@props.pointRadius - @borderWidth}
      fill={@fill}
      value={d.value}
      stroke={@props.color}
      strokeWidth={@borderWidth}
      onMouseOver={@props.onCircleMouseOver}
      onMouseOut={@props.onCircleMouseOut}
    />

  line: (p, i) ->
    <line
      key={i}
      x1={p.coord1.x + "%"}
      y1={p.coord1.y + "%"}
      x2={p.coord2.x + "%"}
      y2={p.coord2.y + "%"}
      stroke={@props.color}
      strokeWidth={@borderWidth}
    />

  render: ->
    circles = @props.coords.map(@circle)
    lines = @props.coordPairs.map(@line)

    <g>
      <g>{lines}</g>
      <g>{circles}</g>
    </g>
