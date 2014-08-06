# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'PointMark'

  render: ->
    <g className="circle-mark">
      <circle cx={@props.x} cy={@props.y} r="7" />
    </g>
