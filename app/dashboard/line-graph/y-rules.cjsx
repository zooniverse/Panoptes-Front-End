# @cjsx React.DOM

React = require 'react'

module?.exports = React.createClass
  displayName: 'LineGraphYRules'

  strokeColor: "lightgrey"
  strokeWidth: 1

  yAxisLine: (n, i) ->
    <line
      key={i}
      x1={0}
      x2={100 + "%"}
      y1={@props.height * (n / @props.yLines)}
      y2={@props.height * (n / @props.yLines)}
      stroke={@strokeColor}
      strokeWidth={@strokeWidth}
    />

  render: ->
    yAxisLines = [1...@props.yLines].map(@yAxisLine)
    
    <g>{yAxisLines}</g>

      
