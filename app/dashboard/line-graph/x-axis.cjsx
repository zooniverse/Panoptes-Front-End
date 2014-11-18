React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphXAxis'

  xAxisTick: (percent, i) ->
    <line
      key={i}
      x1={percent + "%"}
      x2={percent + "%"}
      y1={0}
      y2={10}
      stroke={@props.color}
    />

  render: ->
    xAxisTicks = @props.ticks.map(@xAxisTick)

    <g>
      <g>{xAxisTicks}</g>
      <line x1={0} y1={0} x2="100%" y2={0} stroke={@props.color}/>
    </g>
