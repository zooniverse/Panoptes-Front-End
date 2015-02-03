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
    rootProps =
      'data-disabled': @props.tool.props.disabled or null
      'data-selected': @props.tool.props.selected or null
      'data-destroying': @props.tool.state?.destroying or null
      style: color: @props.tool.props.tool.color

    mainStyle =
      fill: 'transparent'
      stroke: 'currentColor'
      strokeWidth: if @props.tool.props.selected
        SELECTED_STROKE_WIDTH
      else
        STROKE_WIDTH

    <g className="drawing-tool" {...rootProps} {...@props}>
      <g className="drawing-tool-main" {...mainStyle} onMouseDown={@props.tool.props.select unless @props.tool.props.disabled}>
        {@props.children}
      </g>
    </g>
