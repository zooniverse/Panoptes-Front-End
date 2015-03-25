React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'

UploadDropTarget = React.createClass
  displayName: 'UploadDropTarget'

  getDefaultProps: ->
    accept: 'text/plain'
    multiple: false
    onSelect: Function.prototype

  getInitialState: ->
    dragEntered: false

  eventsToMakeDropWork: ->
    onDragEnter: @handleDrag.bind this, true
    onDragExit: @handleDrag.bind this, false
    onDragOver: @handleDrag.bind this, null

  hiddenInputStyle:
    height: 0
    opacity: 0
    position: 'absolute'
    width: 0

  render: ->
    style =
      position: 'relative'
      outline: if @state.dragEntered
        '1px solid green'
      else
        '1px dashed gray'

    <label className="upload-drop-target" style={style} {...@eventsToMakeDropWork()} onDrop={@handleDrop}>
      <input type="file" accept={@props.accept} multiple={@props.multiple} onChange={@handleFileSelection} style={@hiddenInputStyle} />
      {@props.children}
    </label>

  handleDrag: (enter, e) ->
    e.stopPropagation()
    e.preventDefault()
    if enter?
      @setState dragEntered: enter

  handleDrop: (e) ->
    e.stopPropagation()
    e.preventDefault()
    @props.onSelect e.dataTransfer.files

  handleFileSelection: (e) ->
    @props.onSelect e.target.files

EditSubjectSetPage = React.createClass
  displayName: 'EditSubjectSetPage'

  getDefaultProps: ->
    subjectSet: null

  getInitialState: ->
    {}

  render: ->
    <div>
      <p>
        Name<br />
        <input type="text" name="display_name" value={@props.subjectSet.display_name} onChange={handleInputChange.bind @props.subjectSet} />
      </p>
      <p>Subjects: {@props.subjectSet.set_member_subjects_count}</p>
      <p>
        <UploadDropTarget onSelect={@handleFileSelection}>Add subjects and manifests</UploadDropTarget>
      </p>
      <p>
        (Retirement rules editor)
      </p>
    </div>

  handleFileSelection: (files) ->
    console.log 'Selected files', files

module.exports = React.createClass
  displayName: 'EditSubjectSetPageWrapper'

  getDefaultProps: ->
    params: null

  render: ->
    <PromiseRenderer promise={apiClient.type('subject_sets').get @props.params.subjectSetID}>{(subjectSet) =>
      <ChangeListener target={subjectSet}>{=>
        <EditSubjectSetPage {...@props} subjectSet={subjectSet} />
      }</ChangeListener>
    }</PromiseRenderer>
