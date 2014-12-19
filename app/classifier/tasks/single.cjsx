React = require 'react'

module.exports = React.createClass
  displayName: 'SingleChoiceTask'

  render: ->
    answers = for answer, i in @props.options
      <label className="workflow-task-answer" key={answer.value}>
        <input type="radio" data-index={i} checked={answer.value is @props.value} onChange={@handleChange} />
        <span className="clickable">{answer.label}</span>
      </label>

    <div className="workflow-task single-choice">
      <div className="question">{@props.question}</div>
      <div className="answers">{answers}</div>
    </div>

  handleChange: (e) ->
    if e.target.checked
      answerIndex = e.target.dataset.index
      answer = @props.options[answerIndex]
      @props.onChange e, answer
