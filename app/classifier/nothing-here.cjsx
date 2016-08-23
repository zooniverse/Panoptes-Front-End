React = require 'react'

NOOP = Function.prototype

module.exports = React.createClass
  displayName: 'NothinHereOption'

  getDefaultProps: ->
    multiple: false
    onChange: NOOP
    task: null

  render: ->
    <label key={Math.random()} className="minor-button answer-button #{if @props.task?.shortcut then 'active' else ''}">
      <div className="answer-button-icon-container">
        <input type="checkbox" checked={@props.task.shortcut} onChange={@initShortcut} />
      </div>
      <div className="answer-button-label-container">
        <label className="answer-button-label">Nothing Here</label>
      </div>
    </label>

  initShortcut: (e) ->
    value = if @props.multiple
      [@props.task.answers.length]
    else
      @props.task.answers.length

    if e.target.checked
      @props.task.shortcut = true
    else
      @props.task.shortcut = false

    newAnnotation = Object.assign {}, @props.annotation, {value: value}
    @props.onChange newAnnotation
