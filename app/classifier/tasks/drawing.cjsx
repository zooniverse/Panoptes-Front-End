React = require 'react'

module.exports = React.createClass
  displayName: 'DrawingTask'

  render: ->
    tools = for tool, i in @props.options
      <label className="workflow-task-answer for-drawing #{tool.type}" key={tool.label}>
        <input type="radio" data-index={i} checked={tool is @props.value} onChange={@handleChange} />
        <span className="clickable">{tool.label}</span>
      </label>

    <div className="workflow-task single-choice drawing-task">
      <div className="question">{@props.question}</div>
      <div className="answers">{tools}</div>
    </div>

  handleChange: (e) ->
    if e.target.checked
      toolIndex = e.target.dataset.index
      tool = @props.options[toolIndex]
      console.log 'Setting tool to', tool
      @props.onChange e, tool
