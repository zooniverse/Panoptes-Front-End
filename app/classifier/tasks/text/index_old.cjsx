React = require 'react'
createReactClass = require 'create-react-class'
_ = require 'lodash'
{Markdown} = require 'markdownz'
GenericTask = require('../generic.jsx').default
TextTaskEditor = require './editor'

NOOP = Function.prototype

Summary = createReactClass
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

module.exports = createReactClass
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

  getDefaultProps: ->
    task:
      instruction: ''
    annotation:
      value: ''
    onChange: NOOP

  getInitialState: ->
    textareaHeight: undefined
    initOffsetHeight: undefined
    value: @props.annotation.value

  componentWillMount: ->
    @debouncedUpdateAnnotation = _.debounce @updateAnnotation, 500

  componentDidMount: ->
    @setState initOffsetHeight: @refs.textInput.offsetHeight
    @updateHeight()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.task isnt @props.task
      @setState { value: '', textareaHeight: @state.initOffsetHeight }, =>
        @updateHeight()
    if nextProps.annotation.value isnt @props.annotation.value
      @setState value: nextProps.annotation.value

  componentDidUpdate: (prevProps) ->
    if prevProps.task isnt @props.task and @props.autoFocus is true
      @refs.textInput.focus()

  componentWillUnMount: ->
    @updateAnnotation()

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
    @setState { value }
    @debouncedUpdateAnnotation()

  updateHeight: ->
    @setState textareaHeight: @refs.textInput.scrollHeight + 2

  render: ->
    <GenericTask question={@props.task.instruction} help={@props.task.help} required={@props.task.required}>
      <label className="answer">
        <textarea
          autoFocus={@props.autoFocus}
          className="standard-input full"
          ref="textInput"
          value={@state.value}
          onChange={@handleChange}
          rows="1"
          style={height: @state.textareaHeight}
        />
      </label>
      {if @props.task.text_tags
        <div className="transcription-metadata-tags">
          {for tag, i in @props.task.text_tags
            <input type="button" className="standard-button text-tag" key={i} value={tag} onClick={@setTagSelection} />}
        </div>}
    </GenericTask>

  handleChange: ->
    value = @refs.textInput.value

    if @state.value?.length > value.length
      @setState textareaHeight: @state.initOffsetHeight, =>
        @updateHeight()
    else
      @updateHeight()

    @setState { value }
    @debouncedUpdateAnnotation()

  updateAnnotation: ->
    value = @refs.textInput.value
    newAnnotation = Object.assign @props.annotation, {value}
    @props.onChange newAnnotation
