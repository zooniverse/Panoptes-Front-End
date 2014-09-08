# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'SingleChoiceTask'

  render: ->
    answers = for answer, i in @props.options
      <label className="workflow-task-answer" key={answer.label}>
        <input type="radio" value={i} checked={answer is @props.value} onChange={@handleChange} />
        <span className="clickable">{answer.label}</span>
      </label>

    <div className="single-choice-task">
      <div className="question">{@props.question}</div>
      <div className="answers">{answers}</div>
    </div>

  handleChange: (e) ->
    answerIndex = e.target.value
    @props.onChange @props.options[answerIndex]
