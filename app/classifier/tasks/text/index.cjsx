React = require 'react'
{Markdown} = require 'markdownz'
GenericTask = require '../generic'
GenericTaskEditor = require '../generic-editor'
levenshtein = require 'fast-levenshtein'

NOOP = Function.prototype

key =
  K: 75
  M: 77

Summary = React.createClass
  displayName: 'TextSummary'

  getDefaultProps: ->
    task: null
    annotation: null
    expanded: false

  render: ->
    <div>
      <div className="question">
        {@props.task.instruction}
      </div>
      <div className="answers">
      {if @props.annotation.value?
        <div className="answer">
          “<code>{@props.annotation.value}</code>”
        </div>}
      </div>
    </div>

module.exports = React.createClass
  displayName: 'TextTask'

  statics:
    Editor: GenericTaskEditor
    Summary: Summary

    getDefaultTask: ->
      type: 'text'
      instruction: 'Enter an instruction.'
      help: ''

    getTaskText: (task) ->
      task.instruction

    getDefaultAnnotation: ->
      value: ''

    isAnnotationComplete: (task, annotation) ->
      annotation.value isnt '' or not task.required

    testAnnotationQuality: (unknown, knownGood) ->
      distance = levenshtein.get unknown.value.toLowerCase(), knownGood.value.toLowerCase()
      length = Math.max unknown.value.length, knownGood.value.length
      (length - distance) / length

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: NOOP

  getInitialState: ->
    prevAnswerIndex: 0

  render: ->
    <GenericTask question={@props.task.instruction} help={@props.task.help} required={@props.task.required}>
      <label className="answer">
        <textarea
          className="standard-input full"
          rows="5"
          ref="textInput"
          value={@props.annotation.value}
          onChange={@handleChange}
          onBlur={@handleBlur.bind(@, @props.task.instruction)}
          onKeyDown={@handleKeyDown.bind(@, @props.task.instruction)}
        />
      </label>
    </GenericTask>

  handleChange: ->
    value = @refs.textInput.value
    newAnnotation = Object.assign @props.annotation, {value}
    @props.onChange newAnnotation

  handleBlur: (question, e) ->
    answer = e.target.value.trim()
    prevAnswers = @getPreviousAnswers(question) or []
    if answer and ((prevAnswers.indexOf answer) is -1)
      prevAnswers.unshift answer
      @setPreviousAnswers(prevAnswers, question)

  handleKeyDown: (question, e) ->
    return unless e.ctrlKey and (e.keyCode is key.M or e.keyCode is key.K)
    prevAnswers = @getPreviousAnswers(question)
    return unless prevAnswers.length
    # accesses previous answers from local storage
    if (e.keyCode is key.M) and (not e.target.value or (prevAnswers.indexOf e.target.value.trim()) isnt -1)
      @props.annotation.value = prevAnswers[@state.prevAnswerIndex]
      @setState prevAnswerIndex: (@state.prevAnswerIndex + 1) %% prevAnswers.length
    # clears current answer from previous answers in local storage and textarea
    if e.keyCode is key.K
      answer = e.target.value.trim()
      unless (prevAnswers.indexOf answer) is -1
        e.target.value = ''
        @setState prevAnswerIndex: 0
        prevAnswers.splice (prevAnswers.indexOf answer), 1
        @setPreviousAnswers(prevAnswers, question)
        @handleChange(e)

  getPreviousAnswers: (question) ->
    JSON.parse localStorage.getItem "#{window.location.pathname}-#{question}"

  setPreviousAnswers: (prevAnswers, question) ->
    localStorage.setItem "#{window.location.pathname}-#{question}", JSON.stringify prevAnswers
