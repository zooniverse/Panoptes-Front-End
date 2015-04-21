React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'
Papa = require 'papaparse'
{Navigation} = require 'react-router'
alert = require '../../lib/alert'
SubjectUploader = require '../../partials/subject-uploader'
BoundResourceMixin = require '../../lib/bound-resource-mixin'
RetirementRulesEditor = require '../../components/retirement-rules-editor'
UploadDropTarget = require '../../components/upload-drop-target'
ManifestView = require '../../components/manifest-view'

NOOP = Function.prototype

VALID_SUBJECT_EXTENSIONS = ['.jpg', '.png', '.gif', '.svg']
INVALID_FILENAME_CHARS = ['/', '\\', ':']

EditSubjectSetPage = React.createClass
  displayName: 'EditSubjectSetPage'

  mixins: [BoundResourceMixin, Navigation]

  boundResource: 'subjectSet'

  getDefaultProps: ->
    subjectSet: null

  getInitialState: ->
    manifests: {}
    files: {}
    deletionError: null
    deletionInProgress: false

  render: ->
    <div>
      <form onSubmit={@handleSubmit}>
        <p>Name <input type="text" name="display_name" value={@props.subjectSet.display_name} className="standard-input" onChange={@handleChange} /></p>
        <p>Retirement <RetirementRulesEditor subjectSet={@props.subjectSet} /></p>

        <p><button type="submit" className="standard-button" disabled={not @props.subjectSet.hasUnsavedChanges()}>Save changes</button> {@renderSaveStatus()}</p>
      </form>

      <hr />

      <p>
        <UploadDropTarget accept="text/csv, text/tab-separated-values, image/*" onSelect={@handleFileSelection}>
          <strong>Drag-and-drop manifests and subject images here.</strong><br />
          Manifests must be <code>.csv</code> or <code>.tsv</code>. The first row should define metadata headers. All other rows should include at least one reference to an image filename in the same directory as the manifest.<br />
          Subject images can be any of: {<span key={ext}><code>{ext}</code>{', ' if VALID_SUBJECT_EXTENSIONS[i + 1]?}</span> for ext, i in VALID_SUBJECT_EXTENSIONS}{' '}
          and may not contain {<span key={char}><code>{char}</code>{', ' if INVALID_FILENAME_CHARS[i + 1]?}</span> for char, i in INVALID_FILENAME_CHARS}.<br />
          <br />
          Current selection: <strong>{Object.keys(@state.manifests).length}</strong> manifests, <strong>{Object.keys(@state.files).length}</strong> other files
        </UploadDropTarget>
      </p>

      <div className="manifests-and-subjects">
        <ul>
          {subjectsToCreate = 0
          for name, {errors, subjects} of @state.manifests
            {ready} = ManifestView.separateSubjects subjects, @state.files
            subjectsToCreate += ready.length

            <li key={name}>
              <ManifestView name={name} errors={errors} subjects={subjects} files={@state.files} onRemove={@handleRemoveManifest.bind this, name} />
            </li>}
        </ul>

        <button type="button" className="major-button" disabled={subjectsToCreate is 0} onClick={@createSubjects}>Upload {subjectsToCreate} new subjects</button>
      </div>

      <hr />

      <p>
        <small>
          <button type="button" className="minor-button" disabled={@state.deletionInProgress} onClick={@deleteSubjectSet}>
            Delete this subject set and its {@props.subjectSet.set_member_subjects_count} subjects
          </button>
        </small>{' '}
        {if @state.deletionError?
          <span className="form-help error">{@state.deletionError.message}</span>}
      </p>
    </div>

  handleSubmit: (e) ->
    e.preventDefault()
    @saveResource()

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
      {data, errors} = Papa.parse e.target.result.trim(), header: true, dynamicTyping: true

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

  handleRemoveManifest: (name) ->
    delete @state.manifests[name]
    @forceUpdate();

  createSubjects: ->
    allSubjects = []
    for name, {subjects} of @state.manifests
      {ready} = ManifestView.separateSubjects subjects, @state.files
      allSubjects.push ready...

    uploadAlert = (resolve) =>
      <SubjectUploader subjects={allSubjects} files={@state.files} project={@props.project} subjectSet={@props.subjectSet} autoStart onComplete={resolve} />

    startUploading = alert uploadAlert
      .then =>
        @setState
          manifests: {}
          files: {}

  deleteSubjectSet: ->
    @setState deletionError: null

    confirmed = confirm 'Really delete this subject set and all its subjects?'

    if confirmed
      @setState deletionInProgress: true

      this.props.subjectSet.delete()
        .then =>
          @props.project.uncacheLink 'subject_sets'
          @transitionTo 'edit-project-details', projectID: @props.project.id
        .catch (error) =>
          @setState deletionError: error
        .then =>
          if @isMounted()
            @setState deletionInProgress: false

module.exports = React.createClass
  displayName: 'EditSubjectSetPageWrapper'

  mixins: [BoundResourceMixin]

  boundResource: ->
    @_subjectSet

  getDefaultProps: ->
    params: null

  render: ->
    <PromiseRenderer promise={apiClient.type('subject_sets').get @props.params.subjectSetID}>{(subjectSet) =>
      # Use this for `onTransitionFrom` change test.
      # This is kinda a hack, but it's fine for now.
      @_subjectSet = subjectSet

      <ChangeListener target={subjectSet}>{=>
        <EditSubjectSetPage {...@props} subjectSet={subjectSet} />
      }</ChangeListener>
    }</PromiseRenderer>
