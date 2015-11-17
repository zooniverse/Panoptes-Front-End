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

  render: ->
    <div className="classification-task-summary">
      <div className="question">
        {@props.task.instruction}
      </div>
      <div className="answers">
      {if @props.annotation.value?
        <div className="answer">
          <i className="fa fa-check-circle-o fa-fw"></i>
          {@props.annotation.value}
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

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: NOOP

  render: ->
    <GenericTask question={@props.task.instruction} help={@props.task.help} required={@props.task.required}>
      <label className="answer">
        <textarea className="standard-input full" rows="5" ref="textInput" value={@props.annotation.value} onChange={@handleChange} />
      </label>
    </GenericTask>

  handleChange: (index, e) ->
    @props.annotation.value = React.findDOMNode(@refs.textInput).value
    @props.onChange? e
