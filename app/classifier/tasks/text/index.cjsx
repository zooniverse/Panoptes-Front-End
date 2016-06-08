React = require 'react'
{Markdown} = (require 'markdownz').default
GenericTask = require '../generic'
TextTaskEditor = require './editor'
levenshtein = require 'fast-levenshtein'

NOOP = Function.prototype

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
    Editor: TextTaskEditor
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
    rows: 1

  setTagSelection: (e) ->
    textTag = e.target.value
    startTag = '[' + textTag + ']'
    endTag = '[/' + textTag + ']'
    textArea = this.refs.textInput
    textAreaValue = textArea.value
    selectionStart = textArea.selectionStart
    selectionEnd = textArea.selectionEnd
    textBefore = textAreaValue.substring(0, selectionStart)
    if selectionStart is selectionEnd
      textAfter = textAreaValue.substring(selectionStart, textAreaValue.length)
      value = textBefore + startTag + endTag + textAfter
    else
      textInBetween = textAreaValue.substring(selectionStart, selectionEnd)
      textAfter = textAreaValue.substring(selectionEnd, textAreaValue.length)
      value = textBefore + startTag + textInBetween + endTag + textAfter
    newAnnotation = Object.assign @props.annotation, {value}
    @props.onChange newAnnotation

  handleClear: (e) ->
    # keyCode 8 is backspace, 46 is delete
    if e.which is 8 or e.which is 46
      @setState rows: 1

  handleResize: ->
    heightChange = @refs.textInput.scrollHeight - @refs.textInput.offsetHeight + 2
    return unless heightChange > 0
    rows = @state.rows
    if heightChange % 22 is 0
      # Chrome, Safari increment rows (heightChange) by 22
      rows = rows + (heightChange / 22)
    else
      # Firefox and Edge increment rows by varying amounts, so the following handles the row increases noted
      switch heightChange
        when 30, 45
          rows = rows + 2
        when 52, 67
          rows = rows + 3
        when 75, 90
          rows = rows + 4
        else
          rows = rows + 1
    @setState rows: rows

  render: ->
    <GenericTask question={@props.task.instruction} help={@props.task.help} required={@props.task.required}>
      <label className="answer">
        <textarea autoFocus={@props.autoFocus} className="standard-input full" rows={@state.rows} ref="textInput" value={@props.annotation.value} onKeyDown={@handleClear} onChange={@handleChange} />
      </label>
      {if @props.task.text_tags
        <div className="transcription-metadata-tags">
          {for tag, i in @props.task.text_tags
            <input type="button" className="standard-button text-tag" key={i} value={tag} onClick={@setTagSelection} />}
        </div>}
    </GenericTask>

  handleChange: ->
    value = @refs.textInput.value

    if @props.annotation.value?.length > value.length
      @setState rows: 1
    @handleResize()

    newAnnotation = Object.assign @props.annotation, {value}
    @props.onChange newAnnotation
