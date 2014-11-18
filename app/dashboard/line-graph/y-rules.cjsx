React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphYRules'

  yAxisLine: (n, i) ->
    <line
      key={i}
      x1={0}
      x2={100 + "%"}
      y1={@props.height * (n / @props.yLines)}
      y2={@props.height * (n / @props.yLines)}
    />

  render: ->
    yAxisLines = [1...@props.yLines].map(@yAxisLine)
    
    <g className="line-graph-y-rules">{yAxisLines}</g>
