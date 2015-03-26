React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'
Papa = require 'papaparse'

VALID_SUBJECT_EXTENSIONS = ['.jpg', '.png', '.gif', '.svg']
INVALID_FILENAME_CHARS = [';'] # TODO: Figure out a good general way to separate filenames.

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
    @setState dragEntered: false

  handleFileSelection: (e) ->
    @props.onSelect e.target.files

EditSubjectSetPage = React.createClass
  displayName: 'EditSubjectSetPage'

  getDefaultProps: ->
    subjectSet: null

  getInitialState: ->
    manifests: {}
    files: {}

  render: ->
    <div>
      <p><small>TODO</small></p>

      <p>
        Name<br />
        <input type="text" name="display_name" value={@props.subjectSet.display_name} onChange={handleInputChange.bind @props.subjectSet} />
      </p>

      <p>Subjects: {@props.subjectSet.set_member_subjects_count}</p>

      <p>
        (<small>TODO</small> Retirement rules editor)
      </p>

      <p>
        <UploadDropTarget onSelect={@handleFileSelection}>Add subjects and manifests</UploadDropTarget>
      </p>

      {if Object.keys(@state.manifests).length is 0
        <div>TODO: List subjects without a manifest</div>
      else
        <div className="manifests-and-subjects">
          <div className="manifests-list">
            Manifests
            <br />
            {for name, {subjects, errors} of @state.manifests
              <div key={name} className="manifest">
                <strong>{name}</strong> ({subjects.length})
                {for {row, message} in errors
                  <div key={row + message} className="form-help error">Error on row {row}: {message}</div>}
              </div>}
          </div>
          <br />

          <div className="subjects-list">
            Subjects
            <br />
            {for name, {subjects} of @state.manifests
              for {locations, metadata} in subjects
                <div key={locations.join()} className="subject">
                  {for file in locations
                    <div key={file} className="location">
                      {if file of @state.files
                        <i className="fa fa-check-circle-o fa-fw"></i>
                      else
                        <i className="fa fa-exclamation-circle fa-fw"></i>}
                      <strong>{locations.join ';'}</strong>
                    </div>}
                   <div className="metadata">{JSON.stringify metadata}</div>
                </div>}
          </div>
        </div>}
    </div>

  handleFileSelection: (files) ->
    for file in files
      if file.type in ['text/csv', 'text/tab-separated-values']
        @_addManifest file
        gotManifest = true
      else if file.type.indexOf('image/') is 0
        @state.files[file.name] = file
        gotFile = true

      if gotFile and not gotManifest
        @forceUpdate()

  _addManifest: (file) ->
    reader = new FileReader
    reader.onload = (e) =>
      # TODO: Look into PapaParse features.
      # Maybe wan we parse the file object directly in a worker.
      {data, errors} = Papa.parse e.target.result, header: true, dynamicTyping: true

      metadatas = for rawData in data
        cleanData = {}
        for key, value of rawData
          cleanData[key.trim()] = value?.trim?() ? value
        cleanData

      subjects = []
      for metadata in metadatas
        locations = @_findFilesInMetadata metadata
        unless locations.length is 0
          subjects.push {locations, metadata}

      @state.manifests[file.name] = {errors, subjects}
      @forceUpdate()

    reader.readAsText file

  _findFilesInMetadata: (metadata) ->
    filesInMetadata = []
    for key, value of metadata
      filesInValue = value.match? ///([^#{INVALID_FILENAME_CHARS.join ''}]+(?:#{VALID_SUBJECT_EXTENSIONS.join '|'}))///gi
      if filesInValue?
        filesInMetadata.push filesInValue...
    filesInMetadata

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
