# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'RadioTask'

  render: ->
    currentAnswers = @props.answer ? []
    answers = for answer, i in @props.answers
      <label className="answer" key={i}>
        <input type="checkbox" name="currentTaskAnswer" value={i} checked={answer.value in currentAnswers} onChange={@handleChange} />
        <span className="clickable">{answer.label}</span>
      </label>

    <div className="multiple-choice-task">
      <div className="question">{@props.question}</div>
      <div className="answers">{answers}</div>
    </div>

  handleChange: (e) ->
    newAnswer = @props.answers[e.target.value].value
    existingAnswers = @props.answer ? []

    # We'll make some effort to preserve the order things were chosen in.

    if e.target.checked
      if newAnswer not in existingAnswers
        existingAnswers.push newAnswer
    else
      if newAnswer in existingAnswers
        index = existingAnswers.indexOf newAnswer
        existingAnswers.splice index, 1

    if existingAnswers.length is 0
      existingAnswers = null

    @props.onChange existingAnswers
