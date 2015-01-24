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

Summary = React.createClass
  displayName: 'SingleChoiceSummary'

  getDefaultProps: ->
    task: null
    annotation: null

  render: ->
    <div className="classification-task-summary">
      <div className="question">{@props.task.instruction}</div>
      {for tool, i in @props.task.tools
        <div key={tool.label} className="answer">
          {tool.label}: {[].concat (mark for mark in @props.annotation.marks when mark.tool is i).length}
        </div>}
    </div>

module.exports = React.createClass
  displayName: 'DrawingTask'

  statics:
    Summary: Summary

    getDefaultAnnotation: ->
      _toolIndex: 0
      marks: []

  getDefaultProps: ->
    task: null
    annotation: null

  render: ->
    <div className="workflow-task single-choice drawing-task">
      <div className="question">{@props.task.instruction}</div>
      <div className="answers">
        {for tool, i in @props.task.tools
          <label key={tool.label} className="workflow-task-answer for-drawing #{tool.type}">
            <input type="radio" checked={i is (@props.annotation._toolIndex ? 0)} onChange={@handleChange.bind this, i} />
            <span className="clickable">
              {icons[tool.type]}
              {tool.label}
            </span>
          </label>}
      </div>
    </div>

  handleChange: (index, e) ->
    if e.target.checked
      @props.annotation.update _toolIndex: index
