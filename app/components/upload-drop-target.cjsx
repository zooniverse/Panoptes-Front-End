React = require 'react'
createReactClass = require 'create-react-class'

NOOP = Function.prototype

HIDDEN_INPUT_STYLE =
  height: 0
  opacity: 0
  position: 'absolute'
  width: 0

module.exports = createReactClass
  displayName: 'UploadDropTarget'

  getDefaultProps: ->
    accept: 'text/plain'
    multiple: false
    onSelect: NOOP

  getInitialState: ->
    active: false

  eventsToMakeDropWork: ->
    onDragEnter: @handleDrag.bind this, true
    onDragExit: @handleDrag.bind this, false
    onDragOver: @handleDrag.bind this, null

  render: ->
    <label className="upload-drop-target" data-active={@state.active ? null} style={position: 'relative'} {...@eventsToMakeDropWork()} onDrop={@handleDrop}>
      <input type="file" accept={@props.accept} multiple={@props.multiple} onChange={@handleFileSelection} style={HIDDEN_INPUT_STYLE} />
      {@props.children}
    </label>

  handleDrag: (enter, e) ->
    e.stopPropagation()
    e.preventDefault()
    if enter?
      @setState active: enter

  handleDrop: (e) ->
    e.stopPropagation()
    e.preventDefault()
    @props.onSelect e.dataTransfer.files
    @setState active: false

  handleFileSelection: (e) ->
    @props.onSelect e.target.files
