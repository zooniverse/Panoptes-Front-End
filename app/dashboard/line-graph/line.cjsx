React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphLine'
  borderWidth: 2

  circle: (d, i) ->
    <circle
      key={i}
      cx={d.x + "%"}
      cy={d.y + "%"}
      r={@props.pointRadius - @borderWidth}
      value={d.value}
      stroke={@props.color}
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
    />

  render: ->
    circles = @props.coords.map(@circle)
    lines = @props.coordPairs.map(@line)

    <g className="line-graph-line">
      <g>{lines}</g>
      <g>{circles}</g>
    </g>
