# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'MultipleChoiceTask'

  render: ->
    console?.log "Rendering #{@constructor.displayName}", '@props', @props, '@state', @state

    existingAnswers = @props.value ? []
    answers = for answer, i in @props.options
      <label className="workflow-task-answer" key={answer.label}>
        <input type="checkbox" value={i} checked={answer in existingAnswers} onChange={@handleChange} />
        <span className="clickable">{answer.label}</span>
      </label>

    <div className="multiple-choice-task">
      <div className="question">{@props.question}</div>
      <div className="answers">{answers}</div>
    </div>

  handleChange: (e) ->
    newAnswer = @props.options[e.target.value]
    existingAnswers = @props.value ? []

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
