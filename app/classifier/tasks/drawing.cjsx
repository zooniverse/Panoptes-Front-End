React = require 'react'

icons =
  point: <svg className="drawing-tool-icon" viewBox="0 0 100 100">
    <circle className="shape" r="30" cx="50" cy="50" />
    <line className="shape" x1="50" y1="5" x2="50" y2="40" />
    <line className="shape" x1="95" y1="50" x2="60" y2="50" />
    <line className="shape" x1="50" y1="95" x2="50" y2="60" />
    <line className="shape" x1="5" y1="50" x2="40" y2="50" />
  </svg>

  line: <svg className="drawing-tool-icon" viewBox="0 0 100 100">
    <line className="shape" x1="25" y1="90" x2="75" y2="10" />
  </svg>

  rectangle: <svg className="drawing-tool-icon" viewBox="0 0 100 100">
    <rect className="shape" x="10" y="30" width="80" height="40" />
  </svg>

  polygon: <svg className="drawing-tool-icon" viewBox="0 0 100 100">
    <polyline className="shape" points="50, 5 90, 90 50, 70 5, 90 50, 5" />
  </svg>

  ellipse: <svg className="drawing-tool-icon" viewBox="0 0 100 100">
    <ellipse className="shape" rx="45" ry="30" cx="50" cy="50" transform="rotate(-30, 50, 50)" />
  </svg>

module.exports = React.createClass
  displayName: 'DrawingTask'

  getDefaultProps: ->
    task: null
    currentTool: null

  render: ->
    <div className="workflow-task single-choice drawing-task">
      <div className="question">{@props.task.instruction}</div>
      <div className="answers">
        {for tool, i in @props.task.tools
          <label className="workflow-task-answer for-drawing #{tool.type}" key={tool.label}>
            <input type="radio" data-index={i} checked={tool is @props.currentTool} onChange={@handleChange} />
            <span className="clickable">
              {icons[tool.type]} {tool.label}
            </span>
          </label>}
      </div>
    </div>

  handleChange: (e) ->
    if e.target.checked
      toolIndex = e.target.dataset.index
      tool = @props.task.tools[toolIndex]
      @props.onChange tool
