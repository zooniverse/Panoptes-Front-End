# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'PointTool'

  render: ->
    <circle className="point-tool" cx={@props.x} cy={@props.y} r="5" />
