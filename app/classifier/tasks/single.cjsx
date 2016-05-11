React = require 'react'
{Markdown} = require 'markdownz'
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
    <div>
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
              <Markdown tag="span" inline={true}>{@props.task.answers[i].label}</Markdown>
            </div>
        else if @props.annotation.value?
          <div className="answer">
            <i className="fa fa-check-circle-o fa-fw"></i>
            <Markdown tag="span" inline={true}>{@props.task.answers[@props.annotation.value].label}</Markdown>
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

    isAnnotationComplete: (task, annotation) ->
      annotation.value? or not task.required

    testAnnotationQuality: (unknown, knownGood) ->
      if unknown.value is knownGood.value
        1
      else
        0

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: NOOP

  render: ->
    answers = for answer, i in @props.task.answers
      answer._key ?= Math.random()
      <label key={answer._key} className="minor-button answer-button #{if i is @props.annotation.value then 'active' else ''}">
        <div className="answer-button-icon-container">
          <input type="radio" checked={i is @props.annotation.value} onChange={@handleChange.bind this, i} />
        </div>
        <div className="answer-button-label-container">
          <Markdown className="answer-button-label">{answer.label}</Markdown>
        </div>
      </label>

    <GenericTask question={@props.task.question} help={@props.task.help} answers={answers} required={@props.task.required} />

  handleChange: (index, e) ->
    if e.target.checked
      newAnnotation = Object.assign {}, @props.annotation, value: index
      @props.onChange newAnnotation
