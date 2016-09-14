React = require 'react'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
ChangeListener = require '../../components/change-listener'
Papa = require 'papaparse'
alert = require '../../lib/alert'
SubjectViewer = require '../../components/subject-viewer'
SubjectUploader = require '../../partials/subject-uploader'
UploadDropTarget = require '../../components/upload-drop-target'
ManifestView = require '../../components/manifest-view'
isAdmin = require '../../lib/is-admin'

NOOP = Function.prototype

VALID_SUBJECT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg']
INVALID_FILENAME_CHARS = ['/', '\\', ':', ',']
MAX_FILE_SIZE = 600 * 1024

announceSetChange = ->
  apiClient.type('subject_sets').emit 'add-or-remove'

SubjectSetListingRow = React.createClass
  displayName: 'SubjectSetListingRow'

  getDefaultProps: ->
    subject: {}
    onPreview: Function.prototype # No-op
    onRemove: Function.prototype

  getInitialState: ->
    beingDeleted: false

  render: ->
    <tr key={@props.subject.id}>
      <td>
        <small className="form-help">{@props.subject.id}{"- #{@props.subject.metadata.Filename}" if @props.subject.metadata.Filename?}</small>
      </td>
      <td>
        <button type="button" disabled={@state.beingDeleted} onClick={@props.onPreview.bind null, @props.subject}><i className="fa fa-eye fa-fw"></i></button>
        <button type="button" disabled={@state.beingDeleted} onClick={@handleRemove}><i className="fa fa-trash-o fa-fw"></i></button>
      </td>
    </tr>

  handleRemove: ->
    @setState beingDeleted: true
    @props.onRemove @props.subject

SubjectSetListingTable = React.createClass
  displayName: 'SubjectSetListing'

  getDefaultProps: ->
    subjects: []
    onPreview: Function.prototype
    onRemove: Function.prototype

  render: ->
    <table>
      <tbody>
        {for subject in @props.subjects
          <SubjectSetListingRow key={subject.id} subject={subject} onPreview={@props.onPreview} onRemove={@props.onRemove} />}
      </tbody>
    </table>

SubjectSetListing = React.createClass
  displayName: 'SubjectSetListing'

  getDefaultProps: ->
    subjectSet: {}

  getInitialState: ->
    page: 1
    pageCount: NaN

  render: ->
    gettingSetMemberSubjects = apiClient.type('set_member_subjects').get
      subject_set_id: @props.subjectSet.id
      page: @state.page

    gettingSetMemberSubjects.then ([setMemberSubject]) =>
      newPageCount = setMemberSubject?.getMeta().page_count
      unless newPageCount is @state.pageCount
        @setState pageCount: newPageCount

    gettingSubjects = gettingSetMemberSubjects.get 'subject'

    <div>
      <PromiseRenderer promise={gettingSubjects} then={(subjects) =>
        <SubjectSetListingTable subjects={subjects} onPreview={@previewSubject} onRemove={@removeSubject} />
      } />
      <nav className="pagination">
        Page <select value={@state.page} disabled={@state.pageCount < 2 or isNaN @state.pageCount} onChange={(e) => @setState page: e.target.value}>
          {if isNaN @state.pageCount
            <option>?</option>
          else
            for p in [1..@state.pageCount]
              <option key={p} value={p}>{p}</option>}
        </select> of {@state.pageCount || '?'}
      </nav>
    </div>

  previewSubject: (subject) ->
    alert <div className="content-container subject-preview">
      <SubjectViewer subject={subject} />
    </div>

  removeSubject: (subject) ->
    @props.subjectSet.removeLink('subjects', subject.id).then =>
      announceSetChange()

EditSubjectSetPage = React.createClass
  displayName: 'EditSubjectSetPage'

  contextTypes:
    router: React.PropTypes.object.isRequired

  getDefaultProps: ->
    subjectSet: null

  getInitialState: ->
    manifests: {}
    tooBigFiles: {}
    files: {}
    deletionError: null
    deletionInProgress: false
    successfulCreates: []
    successfulUploads: []
    creationErrors: []

  subjectLimitMessage: (project_subject_count, user) ->
    "The project has " + project_subject_count + " uploaded subjects. " +
    "You have uploaded " + user.uploaded_subjects_count + " subjects from an " +
    "allowance of " + user.subject_limit + ". Your uploaded subject count is the tally of all subjects (including those deleted) that your account has uploaded through the project builder or Zooniverse API."

  render: ->
    <div>
      <h3>{@props.subjectSet.display_name} #{@props.subjectSet.id}</h3>
      <p className="form-help">A subject is a unit of data to be analyzed. A subject can include one or more images that will be analyzed at the same time by volunteers. A subject set consists of a list of subjects (the “manifest”) defining their properties, and the images themselves.</p>
      <p className="form-help">Feel free to group subjects into sets in the way that is most useful for your research. Many projects will find it’s best to just have all their subjects in 1 set, but not all.</p>
      <p className="form-help">{@subjectLimitMessage(@props.project.subjects_count, @props.user)} </p>
      <p className="form-help"><strong>We strongly recommend uploading subjects in batches of 500 - 1,000 at a time.</strong></p>

      <form onSubmit={@handleSubmit}>
        <p>
          <AutoSave resource={@props.subjectSet}>
            <span className="form-label">Name</span>
            <br />
            <input type="text" name="display_name" placeholder="Subject Set Name" value={@props.subjectSet.display_name} className="standard-input full" onChange={handleInputChange.bind @props.subjectSet} />
          </AutoSave>
          <small className="form-help">A subject set’s name is only seen by the research team.</small>
        </p>
      </form>

      <hr />

      This set contains {@props.subjectSet.set_member_subjects_count} subjects:<br />
      <SubjectSetListing subjectSet={@props.subjectSet} />

      <hr />

      <p>
        <UploadDropTarget accept={"text/csv, text/tab-separated-values, image/*#{if isAdmin() then ', video/*' else ''}"} multiple onSelect={@handleFileSelection}>
          <strong>Drag-and-drop or click to upload manifests and subject images here.</strong><br />
          Manifests must be <code>.csv</code> or <code>.tsv</code>. The first row should define metadata headers. All other rows should include at least one reference to an image filename in the same directory as the manifest.<br />
          Headers that begin with "#" or "//" denote private fields that will not be visible to classifiers in the main classification interface or in the Talk discussion tool.<br />
          Headers that begin with "!" denote fields that <strong>will not</strong> be visible to classifiers in the main classification interface but <strong>will be </strong> visible after classification in the Talk discussion tool.<br />
          Subject images can be up to {MAX_FILE_SIZE / 1024}KB and any of: {<span key={ext}><code>{ext}</code>{', ' if VALID_SUBJECT_EXTENSIONS[i + 1]?}</span> for ext, i in VALID_SUBJECT_EXTENSIONS}{' '}
          and may not contain {<span key={char}><kbd>{char}</kbd>{', ' if INVALID_FILENAME_CHARS[i + 1]?}</span> for char, i in INVALID_FILENAME_CHARS}<br />
        </UploadDropTarget>
      </p>

      <div className="manifests-and-subjects">
        <ul>
          {subjectsToCreate = 0
          for name, {errors, subjects} of @state.manifests
            {ready} = ManifestView.separateSubjects subjects, @state.files, @state.tooBigFiles
            subjectsToCreate += ready.length
            <li key={name}>
              <ManifestView name={name} errors={errors} tooBigFiles={@state.tooBigFiles} subjects={subjects} files={@state.files} onRemove={@handleRemoveManifest.bind this, name} />
            </li>}
        </ul>

        <button type="button" className="major-button" disabled={subjectsToCreate is 0} onClick={@createSubjects}>Upload {subjectsToCreate} new subjects</button>

        {unless @state.successfulCreates.length is 0
          <div>{@state.successfulCreates.length} subjects created (with {@state.successfulUploads.length} files uploaded).</div>}

        {unless @state.creationErrors.length is 0
          <div>
            Errors creating subjects:
            <ul>
              {for error in @state.creationErrors
                <li className="form-help error">{error.message}</li>}
            </ul>
          </div>}
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
    @setState
      successfulCreates: []
      successfulUploads: []
      creationErrors: []

    for file in files when file.size isnt 0
      if file.type in ['text/csv', 'text/tab-separated-values']
        @_addManifest file
        gotManifest = true
      else if file.type.indexOf('image/') is 0 or (isAdmin() and file.type.indexOf('video/') is 0)
        if file.size < MAX_FILE_SIZE or isAdmin()
          @state.files[file.name] = file
          gotFile = true
        else
          @state.tooBigFiles[file.name] = file
          gotFile = true
      else if file.type? # When Windows fails to detect MIME type and returns an empty string for file.type
        allowedFileExts = ['csv', 'tsv']
        ext = file.name.split('.').pop()
        if allowedFileExts.indexOf(ext) > -1
          @_addManifest file
          gotManifest = true

    unless gotManifest
      autoManifest = []
      for name, _ of @state.files
        autoManifest.push { Filename: name }
      for name, _ of @state.tooBigFiles
        autoManifest.push { Filename: name }

      @subjectsFromManifest(autoManifest, [], "AutoGeneratedManifest")

  _addManifest: (file) ->
    reader = new FileReader
    reader.onload = (e) =>
      # TODO: Look into PapaParse features.
      # Maybe wan we parse the file object directly in a worker.
      {data, errors} = Papa?.parse e.target.result.trim(), header: true
      @subjectsFromManifest(data, errors, file.name)
    reader.readAsText file

  subjectsFromManifest: (data, errors, fileName) ->
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

    @state.manifests[fileName] = {errors, subjects}
    console.log(@state.manifests)
    @forceUpdate()

  _findFilesInMetadata: (metadata) ->
    filesInMetadata = []
    for key, value of metadata
      extensions = if isAdmin() then '\\.\\D\\w{2,4}' else "(?:#{'\\'+VALID_SUBJECT_EXTENSIONS.join '|\\'})"
      filesInValue = value.match? ///([^#{'\\'+INVALID_FILENAME_CHARS.join '\\'}]+#{extensions})///gi
      if filesInValue?
        filesInMetadata.push filesInValue...
    filesInMetadata

  handleRemoveManifest: (name) ->
    delete @state.manifests[name]
    @forceUpdate();

  createSubjects: ->
    allSubjects = []
    for name, {subjects} of @state.manifests
      {ready} = ManifestView.separateSubjects subjects, @state.files, @state.tooBigFiles
      allSubjects.push ready...

    uploadAlert = (resolve) =>
      <div className="content-container">
        <SubjectUploader subjects={allSubjects} files={@state.files} project={@props.project} subjectSet={@props.subjectSet} autoStart onComplete={resolve} />
      </div>

    startUploading = alert uploadAlert
      .then ({creates, uploads, errors}) =>
        @setState
          successfulCreates: creates
          successfulUploads: uploads
          creationErrors: errors
          manifests: {}
          files: {}
        announceSetChange()

  deleteSubjectSet: ->
    @setState deletionError: null

    confirmed = confirm 'Really delete this subject set and all its subjects?'

    if confirmed
      @setState deletionInProgress: true

      this.props.subjectSet.delete()
        .then =>
          announceSetChange()
          @props.project.uncacheLink 'subject_sets'
          @context.router.push "/lab/#{@props.project.id}"
        .catch (error) =>
          @setState deletionError: error
        .then =>
          if @isMounted()
            @setState deletionInProgress: false

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
