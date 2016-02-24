React = require 'react'
GenericTask = require './generic'
{Markdown} = require 'markdownz'
GenericTaskEditor = require './generic-editor'

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
    Editor: GenericTaskEditor
    Summary: Summary

    getDefaultTask: ->
      type: 'multiple'
      question: 'Enter a question.'
      help: ''
      answers: []

    getTaskText: (task) ->
      task.question

    getDefaultAnnotation: ->
      value: []

    isAnnotationComplete: (task, annotation) ->
      # Booleans compare to numbers as expected: true = 1, false = 0. Undefined does not.
      annotation.value.length >= (task.required ? 0)

    testAnnotationQuality: (unknown, knownGood) ->
      total = 0
      matches = 0
      unknown.value.forEach (value) ->
        total += 1
        if value in knownGood.value
          matches += 1
      knownGood.value.forEach (value) ->
        total += 1
        if value in unknown.value
          matches += 1
      if total is 0
        1
      else
        matches / total

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: NOOP

  render: ->
    answers = for answer, i in @props.task.answers
      answer._key ?= Math.random()
      <label key={answer._key} className="minor-button answer-button #{if i in @props.annotation.value then 'active' else ''}">
        <div className="answer-button-icon-container">
          <input type="checkbox" checked={i in @props.annotation.value} onChange={@handleChange.bind this, i} />
        </div>
        <div className="answer-button-label-container">
          <Markdown className="answer-button-label">{answer.label}</Markdown>
        </div>
      </label>

    <GenericTask question={@props.task.question} help={@props.task.help} answers={answers} required={@props.task.required} />

  handleChange: (index, e) ->
    value = @props.annotation.value.slice 0

    if e.target.checked
      if index not in value
        value.push index
    else
      if index in value
        indexInValue = value.indexOf index
        value.splice indexInValue, 1

    newAnnotation = Object.assign {}, @props.annotation, {value}
    @props.onChange newAnnotation
