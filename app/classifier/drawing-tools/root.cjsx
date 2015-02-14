React = require 'react'

STROKE_WIDTH = 1.5
SELECTED_STROKE_WIDTH = 2.5

module.exports = React.createClass
  displayName: 'DrawingToolRoot'

  getDefaultProps: ->
    tool: null

  getInitialState: ->
    destroying: false

  render: ->
    toolProps = @props.tool.props

    rootProps =
      'data-disabled': toolProps.disabled or null
      'data-selected': toolProps.selected or null
      'data-destroying': @props.tool.state?.destroying or null
      style: color: toolProps.color

    mainStyle =
      fill: 'transparent'
      stroke: 'currentColor'
      strokeWidth: if toolProps.selected
        SELECTED_STROKE_WIDTH
      else
        STROKE_WIDTH

    <g className="drawing-tool" {...rootProps} {...@props}>
      <g className="drawing-tool-main" {...mainStyle} onMouseDown={toolProps.onSelect unless toolProps.disabled}>
        {@props.children}
      </g>
    </g>
