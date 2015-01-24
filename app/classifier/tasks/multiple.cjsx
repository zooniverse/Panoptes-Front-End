React = require 'react'

Summary = React.createClass
  displayName: 'SingleChoiceSummary'

  render: ->
    <div className="classification-task-summary">
      <div className="question">{@props.task.question}</div>
      <div className="answer">
        {for index in @props.annotation.answers
          <div>{@props.task.answers[index].label}</div>}
      </div>
    </div>

module.exports = React.createClass
  displayName: 'MultipleChoiceTask'

  statics:
    Summary: Summary

    getDefaultAnnotation: ->
      answers: []

  getDefaultProps: ->
    task: null
    annotation: null

  render: ->
    existingAnswers = @props.annotation.answers

    <div className="workflow-task multiple-choice-task">
      <div className="question">{@props.task.question}</div>
      <div className="answers">{for answer, i in @props.task.answers
        <label className="workflow-task-answer" key={answer.label}>
          <input type="checkbox" checked={i in existingAnswers} onChange={@handleChange.bind this, i} />
          <span className="clickable">{answer.label}</span>
        </label>}
      </div>
    </div>

  handleChange: (index, e) ->
    answers = @props.annotation.answers

    if e.target.checked
      if index not in answers
        answers.push index
    else
      if index in answers
        indexInAnswers = answers.indexOf index
        answers.splice indexInAnswers, 1

    @props.annotation.update answers: ->
      answers
