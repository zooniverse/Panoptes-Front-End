React = require 'react'
{Markdown} = require 'markdownz'
GenericTask = require '../generic'
GenericTaskEditor = require '../generic-editor'

NOOP = Function.prototype

Summary = React.createClass
  displayName: 'TextSummary'

  getDefaultProps: ->
    task: null
    annotation: null
    expanded: false

  getInitialState: ->
    expanded: @props.expanded

  render: ->
    <div className="classification-task-summary">
      <div className="question">
        {@props.task.instruction}
        {if @state.expanded
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: false, null}>Less</button>
        else
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: true, null}>More</button>}
      </div>
      <div className="answers">
      {if @props.annotation.value?
        <div className="answer">
          <i className="fa fa-check-circle-o fa-fw"></i>
          <Markdown>{@props.annotation.value}</Markdown>
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
      answers: []

    getTaskText: (task) ->
      task.instruction

    getDefaultAnnotation: ->
      value: null

    isAnnotationComplete: (task, annotation) ->
      annotation.value? or not task.required

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: NOOP

  render: ->
    answers =
      <label className="answer">
        <textarea ref="textInput" onChange={@handleChange} />
      </label>

    <GenericTask question={@props.task.instruction} help={@props.task.help} answers={answers} required={@props.task.required} />

  handleChange: (index, e) ->
    @props.annotation.value = @refs.textInput.getDOMNode().value
    @props.onChange? e
