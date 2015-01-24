React = require 'react'

Summary = React.createClass
  displayName: 'SingleChoiceSummary'

  render: ->
    <div className="classification-task-summary">
      <div className="question">{@props.task.question}</div>
      <div className="answer">{@props.task.answers[@props.annotation.answer]}</div>
    </div>

module.exports = React.createClass
  displayName: 'SingleChoiceTask'

  statics:
    Summary: Summary

    getDefaultAnnotation: ->
      answer: null

  getDefaultProps: ->
    task: null
    annotation: null

  render: ->
    <div className="workflow-task single-choice">
      <div className="question">{@props.question}</div>
      <div className="answers">
        {for answer, i in @props.task.answers
          <label className="workflow-task-answer" key={answer.label}>
            <input type="radio" checked={i is @props.annotation.answer} onChange={@handleChange.bind this, i} />
            <span className="clickable">{answer.label}</span>
          </label>}
      </div>
    </div>

  handleChange: (index, e) ->
    if e.target.checked
      @props.annotation.update
        answer: index
