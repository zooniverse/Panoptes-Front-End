# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'DeleteButton'

  render: ->
    radius = 10

    cross = "
      M #{-1 * radius * 0.6 } 0
      L #{radius * 0.6 } 0
      M 0 #{-1 * radius * 0.6 }
      L 0 #{radius * 0.6 }
    "

    @transferPropsTo <g className="clickable drawing-tool-delete-button" stroke="white" strokeWidth="2" onClick={@props.onClick}>
      <circle r={radius} fill="black" />
      <path d={cross} transform="rotate(45)" />
    </g>
