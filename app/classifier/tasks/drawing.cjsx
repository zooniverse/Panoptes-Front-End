# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'DrawingTask'

  render: ->
    tools = for tool, i in @props.options
      <label className="workflow-task-answer drawing-tool #{tool.type}" key={tool.label}>
        <input type="radio" value={i} checked={tool is @props.value} onChange={@handleChange} />
        <span className="clickable">{tool.label}</span>
      </label>

    <div className="single-choice-task">
      <div className="question">{@props.question}</div>
      <div className="tools answers">{tools}</div>
    </div>

  handleChange: (e) ->
    if e.target.checked
      toolIndex = e.target.value

    tool = @props.options[toolIndex]
    @props.onChange tool
