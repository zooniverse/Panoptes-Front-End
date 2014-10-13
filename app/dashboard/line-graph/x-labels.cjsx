# @cjsx React.DOM

React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphXLabels'

  height: 25
  color: "darkgrey"

  xLabelTextAnchor: (i) ->
    switch i
      when 0 then 'start'
      when (@xAxisLabels().length - 1) then 'end'
      else 'middle'

  xAxisLabels: ->
    # [first, middle, last] x-labels
    dataLength = @props.data.length

    [@props.data[0][@props.xKey],
     @props.data[Math.floor(dataLength / 2)][@props.xKey],
     @props.data[dataLength - 1][@props.xKey]]

  xAxisLabel: (date, i) ->
    <text
      key={i}
      x={((i / 2) * 100) + "%"}
      y={20}
      style={textAnchor: @xLabelTextAnchor(i)}
      fill={@color}>
        {date}
    </text>

  render: ->
    labels = @xAxisLabels().map(@xAxisLabel)

    <svg width="100%" height={@height}>
      <g>{labels}</g>
    </svg>
