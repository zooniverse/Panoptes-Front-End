# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'PointTool'

  render: ->
    <g className="point drawing-tool" transform="translate(#{@props.x}, #{@props.y})">
      <g  transform="scale(#{1 / @props.scale.horizontal}, #{1 / @props.scale.vertical})">
        <circle className="point-tool-disc" cx="0" cy="0" r="5" />
      </g>
    </g>
