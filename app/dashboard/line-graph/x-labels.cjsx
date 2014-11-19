React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphXLabels'

  xAxisLabels: ->
    # [first, middle, last] x-labels
    dataLength = @props.data.length

    [@props.data[0][@props.xKey],
     @props.data[Math.floor(dataLength / 2)][@props.xKey],
     @props.data[dataLength - 1][@props.xKey]]

  xAxisLabel: (date, i) ->
    <text key={i} x={((i / 2) * 100) + "%"} y={20}>
      {date}
    </text>

  render: ->
    labels = @xAxisLabels().map(@xAxisLabel)

    <svg className="line-graph-x-labels">
      <g>{labels}</g>
    </svg>
