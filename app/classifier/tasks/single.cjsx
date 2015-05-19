React = require 'react'
Markdown = require '../../components/markdown'
GenericTask = require './generic'
GenericTaskEditor = require './generic-editor'

NOOP = Function.prototype

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
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: false, null}>Less</button>
        else
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: true, null}>More</button>}
      </div>
      <div className="answers">
        {if @state.expanded
          for answer, i in @props.task.answers
            answer._key ?= Math.random()
            <div key={answer._key} className="answer">
              {if i is @props.annotation.value
                <i className="fa fa-check-circle-o fa-fw"></i>
              else
                <i className="fa fa-circle-o fa-fw"></i>}
              {@props.task.answers[i].label}
            </div>
        else if @props.annotation.value?
          <div className="answer">
            <i className="fa fa-check-circle-o fa-fw"></i>
            {@props.task.answers[@props.annotation.value].label}
          </div>
        else
          <div className="answer">No answer</div>}
      </div>
    </div>

module.exports = React.createClass
  displayName: 'SingleChoiceTask'

  statics:
    Editor: GenericTaskEditor
    Summary: Summary

    getDefaultTask: ->
      type: 'single'
      question: 'Enter a question.'
      help: ''
      answers: []

    getTaskText: (task) ->
      task.question

    getDefaultAnnotation: ->
      value: null

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: NOOP

  render: ->
    answers = for answer, i in @props.task.answers
      answer._key ?= Math.random()
      <label key={answer._key} className="minor-button #{if i is @props.annotation.value then 'active' else ''}">
        <input type="radio" checked={i is @props.annotation.value} onChange={@handleChange.bind this, i} />
        <Markdown>{answer.label}</Markdown>
      </label>

    <GenericTask question={@props.task.question} help={@props.task.help} answers={answers} />

  handleChange: (index, e) ->
    if e.target.checked
      @props.annotation.value = index
      @props.onChange? e
