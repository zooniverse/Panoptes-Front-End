React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphYLabels'

  yAxisLabel: (n, i) ->
    <text
      key={i}
      x={0}
      y={((n / @props.yLines) * 100) + "%"}
      dy={-4}
      strokeWidth={1}>
      {@dataRangePoint(n)}
    </text>

  render: ->
    yAxisLabels = [1...@props.yLines].map(@yAxisLabel)

    <g className="line-graph-y-labels">{yAxisLabels}</g>

  dataRangePoint: (n) ->
    Math.round (@props.max - (n / @props.yLines) * @props.max)
