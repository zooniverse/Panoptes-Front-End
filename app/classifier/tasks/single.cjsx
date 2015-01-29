React = require 'react'

Summary = React.createClass
  displayName: 'SingleChoiceSummary'

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
              {if i is @props.annotation.value
                <i className="fa fa-check-circle-o fa-fw"></i>
              else
                <i className="fa fa-circle-o fa-fw"></i>}
              {@props.task.answers[i].label}
            </div>
        else
          <div className="answer">
            {if @props.annotation.value?
              @props.task.answers[@props.annotation.value].label
            else
              'No answer'}
          </div>}
      </div>
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
      <div className="question">{@props.task.question}</div>
      <div className="answers">
        {for answer, i in @props.task.answers
          <label className="workflow-task-answer" key={answer.label}>
            <input type="radio" checked={i is @props.annotation.value} onChange={@handleChange.bind this, i} />
            <span className="clickable">{answer.label}</span>
          </label>}
      </div>
    </div>

  handleChange: (index, e) ->
    if e.target.checked
      @props.annotation.update
        value: index
