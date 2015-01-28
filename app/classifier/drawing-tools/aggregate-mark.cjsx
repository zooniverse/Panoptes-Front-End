React = require 'react'
drawingTools = require './index'

module.exports = React.createClass
  displayName: 'AggregateMark'

  getDefaultProps: ->
    toolDefinition: null
    mark: null
    sourceMarks: null

  render: ->
    Tool = drawingTools[@props.toolDefinition.type]
    <g className="aggregate-mark">
      <Tool mark={@props.mark} tool={@props.toolDefinition} />
      <g className="source-marks">
        {for mark, i in @props.sourceMarks
          console.info mark
          <Tool key={i} mark={mark} tool={@props.toolDefinition} />}
      </g>
    </g>
