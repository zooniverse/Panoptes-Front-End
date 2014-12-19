React = require 'react'

module.exports = React.createClass
  displayName: 'MultipleChoiceTask'

  render: ->
    existingAnswers = @props.value ? []
    answers = for answer, i in @props.options
      <label className="workflow-task-answer" key={answer.value}>
        <input type="checkbox" data-index={i} checked={answer.value in existingAnswers} onChange={@handleChange} />
        <span className="clickable">{answer.label}</span>
      </label>

    <div className="workflow-task multiple-choice-task">
      <div className="question">{@props.question}</div>
      <div className="answers">{answers}</div>
    </div>

  handleChange: (e) ->
    answers = @props.value ? []

    answerIndex = e.target.dataset.index
    newAnswer = @props.options[answerIndex].value

    # We'll make some effort to preserve the order things were chosen in.

    if e.target.checked
      if newAnswer not in answers
        answers.push newAnswer
    else
      if newAnswer in answers
        index = answers.indexOf newAnswer
        answers.splice index, 1

    if answers.length is 0
      answers = null

    @props.onChange e, value: answers
