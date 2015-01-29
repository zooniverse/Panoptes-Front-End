React = require 'react'

Summary = React.createClass
  displayName: 'MultipleChoiceSummary'

  getDefaultProps: ->
    task: null
    annotation: null
    expanded: false

  getInitialState: ->
    expanded: @props.expanded

  render: ->
    <div className="classification-task-summary">
      <div className="question">
        {@props.task.question}
        {if @state.expanded
          <button type="button" onClick={@setState.bind this, expanded: false, null}>Less</button>
        else
          <button type="button" onClick={@setState.bind this, expanded: true, null}>More</button>}
      </div>
      <div className="answers">
        {if @state.expanded
          for answer, i in @props.task.answers
            <div key={i} className="answer">
              {if i in @props.annotation.value
                <i className="fa fa-check-square-o fa-fw"></i>
              else
                <i className="fa fa-square-o fa-fw"></i>}
              {@props.task.answers[i].label}
            </div>
        else
          if @props.annotation.value.length is 0
            <div className="answer">'No answer'</div>
          else
            for index in @props.annotation.value
              <div key={index} className="answer">
                {@props.task.answers[index].label}
              </div>}
      </div>
    </div>

module.exports = React.createClass
  displayName: 'MultipleChoiceTask'

  statics:
    Summary: Summary

    getDefaultAnnotation: ->
      value: []

  getDefaultProps: ->
    task: null
    annotation: null

  render: ->
    existingAnswers = @props.annotation.value

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
    answers = @props.annotation.value

    if e.target.checked
      if index not in answers
        answers.push index
    else
      if index in answers
        indexInAnswers = answers.indexOf index
        answers.splice indexInAnswers, 1

    @props.annotation.update value: ->
      answers
