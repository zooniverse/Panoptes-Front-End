# @cjsx React.DOM

React = require 'react'

RADIUS = 10
CROSS = "
  M #{-1 * RADIUS * 0.6 } 0
  L #{RADIUS * 0.6 } 0
  M 0 #{-1 * RADIUS * 0.6 }
  L 0 #{RADIUS * 0.6 }
"

module.exports = React.createClass
  displayName: 'DeleteButton'

  render: ->

    @transferPropsTo <g className="clickable drawing-tool-delete-button" stroke="white" strokeWidth="2" onClick={@props.onClick}>
      <circle r={RADIUS} fill="black" />
      <path d={CROSS} transform="rotate(45)" />
    </g>
