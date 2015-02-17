React = require 'react'
GenericTask = require './generic'
Markdown = require '../../components/markdown'

NOOP = Function.prototype

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
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: false, null}>Less</button>
        else
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: true, null}>More</button>}
      </div>
      <div className="answers">
        {if @state.expanded
          for answer, i in @props.task.answers
            answer._key ?= Math.random()
            <div key={answer._key} className="answer">
              {if i in @props.annotation.value
                <i className="fa fa-check-square-o fa-fw"></i>
              else
                <i className="fa fa-square-o fa-fw"></i>}
              {answer.label}
            </div>
        else
          if @props.annotation.value.length is 0
            <div className="answer">'No answer'</div>
          else
            for index in @props.annotation.value
              <div key={index} className="answer">
                <i className="fa fa-check-square-o fa-fw"></i>
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
    onChange: NOOP

  render: ->
    answers = for answer, i in @props.task.answers
      answer._key ?= Math.random()
      <label key={answer._key} className="minor-button #{if i in @props.annotation.value then 'active' else ''}">
        <input type="checkbox" checked={i in @props.annotation.value} onChange={@handleChange.bind this, i} />
        <Markdown>{answer.label}</Markdown>
      </label>

    <GenericTask question={@props.task.question} help={@props.task.help} answers={answers} />

  handleChange: (index, e) ->
    answers = @props.annotation.value

    if e.target.checked
      if index not in answers
        answers.push index
    else
      if index in answers
        indexInAnswers = answers.indexOf index
        answers.splice indexInAnswers, 1

    @props.annotation.value = answers
    @props.onChange? e
