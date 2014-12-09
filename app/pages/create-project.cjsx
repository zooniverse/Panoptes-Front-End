React = require 'react'
Model = require '../lib/model'
ChangeListener = require '../components/change-listener'
Route = require '../lib/route'
Link = require '../lib/link'
MarkdownEditor = require '../components/markdown-editor'
JSONEditor = require '../components/json-editor'
apiClient = require '../api/client'
{makeHTTPRequest} = require('json-api-client').util

MANIFEST_COLUMNS = [
  'filenames'
  'timestamps'
  'coord[0]'
  'coord[1]'
  'rotation'
  'coords_type'
]

languages = ['en-us'] # TODO: Where should this live?

DEFAULT_TASKS =
  is_cool:
    type: 'single'
    question: 'Is this image cool?'
    answers: [{
      value: true
      label: 'Yes!'
    }, {
      value: false
      label: 'Nope'
    }]
    next: null

DEFAULT_DATA =
  language: languages[0]
  name: "Something Zoo #{(new Date).toISOString()}"
  introduction: 'Welcome to the Something Zoo'
  description: 'Here is a description.'
  scienceCase: 'Here is some science.'
  subjects: {}
  manifests: {}
  tasks: JSON.stringify DEFAULT_TASKS, null, 2

wizardData = new Model
  refresh: ->
    wizardData.update JSON.parse JSON.stringify DEFAULT_DATA

window.projectCreationWizardData = wizardData
wizardData.refresh()

StepStatusIcon = React.createClass
  displayName: 'StepStatusIcon'

  render: ->
    [iconClass, style] = if @props.completed
      ['fa-check', color: 'green']
    else if @props.error
      ['fa-times', color: 'red']
    else
      ['fa-pencil', opacity: 0.5]

    <i className="fa #{iconClass} fa-fw" style={style}></i>

WizardNavigation = React.createClass
  displayName: 'WizardNavigation'

  render: ->
    <div className="tabbed-content-tabs">
      <Link href="/build/new-project" root={true} className="tabbed-content-tab">
        General
        <StepStatusIcon completed={wizardData.name and wizardData.introduction and wizardData.description} />
      </Link>

      <Link href="/build/new-project/science-case" className="tabbed-content-tab">
        Science case
        <StepStatusIcon completed={wizardData.scienceCase} />
      </Link>

      <Link href="/build/new-project/subjects" className="tabbed-content-tab">
        Subjects
        <StepStatusIcon completed={Object.keys(wizardData.subjects).length isnt 0} />
      </Link>

      <Link href="/build/new-project/workflow" className="tabbed-content-tab">
        Workflow
        <StepStatusIcon completed={wizardData.workflow} />
      </Link>

      <Link href="/build/new-project/review" className="tabbed-content-tab">
        Review
      </Link>
    </div>

module.exports = React.createClass
  displayName: 'CreateProjectPage'

  getInitialState: ->
    step: 'general'

  render: ->
    <ChangeListener target={wizardData} handler={@renderWizard} />

  renderWizard: ->
    <div className="create-project-page tabbed-content content-container" data-side="top">
      <WizardNavigation />

      <Route path="/build/new-project">
        <div className="content-container">
          <h2>General information</h2>
          <p>Let’s get started by creating a basic description of your project. Everything you define here can be changed until your project goes live.</p>
          <fieldset>
            <legend>Project name</legend>
            <input type="text" name="name" placeholder="Project name" value={wizardData.name} onChange={@handleInputChange} style={width: '100%'} />
            <br />
            <div className="form-help">This will be used to identify your project across the site.</div>
          </fieldset>
          <fieldset>
            <legend>Introduction</legend>
            <input type="text" name="introduction" placeholder="A catchy slogan for the project" value={wizardData.introduction} onChange={@handleInputChange} style={width: '100%'} />
            <br />
            <div className="form-help">This will often be shown when a link on the site points to your project.</div>
          </fieldset>
          <fieldset>
            <legend>Project description</legend>
            <MarkdownEditor name="description" placeholder="Why is this project interesting?" value={wizardData.description} onChange={@handleInputChange} style={width: '100%'} />
            <br />
            <div className="form-help">Tell people why they should help with your project. What question are you trying to answer, and why is it important?</div>
          </fieldset>
        </div>
      </Route>

      <Route path="/build/new-project/science-case">
        <div className="content-container">
          <h2>Science case</h2>
          <fieldset>
            <MarkdownEditor name="scienceCase" placeholder="A more detailed explanation of what you hope to achieve with the data you collect" value={wizardData.scienceCase} onChange={@handleInputChange} />
            <span /><div className="form-help">Tell people how the data you collect will be used. What is the expected output of this project?</div>
          </fieldset>
        </div>
      </Route>

      <Route path="/build/new-project/subjects">
        <div className="content-container">
          <h2>Create a set of subjects</h2>
          <p>Now you’ll be able to choose the images you want volunteers to look at (JPEG, PNG, or GIF, please). Optionally, you can include metadata about the images with a manifest file <small>(TODO: describe the manifest)</small>.</p>
          <p>These images will be uploaded during after last step of this process, which could take a long time depending on how many you select. Make sure you’ve got a steady internet connection. You’ll have an opportunity to review and refine your selection here before continuing.</p>

          {for manifestFilename of wizardData.manifests
            <span>
              {manifestFilename}
              <button onClick={@removeManifest.bind this, manifestFilename}>&times;</button>
              &emsp;
            </span>}

          <table>
            <thead>
              <tr>
                {<th>{column}</th> for column in MANIFEST_COLUMNS}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {@_renderSubjectRows()}
            </tbody>
          </table>

          <p><input type="file" accept="image/*,text/tab-separated-values" multiple="multiple" onChange={@handleSubjectFilesSelection} /></p>
        </div>
      </Route>

      <Route path="/build/new-project/workflow">
        <div className="content-container">
          <h2>Define the classification workflow</h2>
          <p>Now you’ll define and link together the tasks each volunteer will do to complete a classification. <small>TODO: This is done in raw JSON for now.</small></p>
          <p className="form-help">Each task object gets a <code>type</code> of <code>single</code> or <code>multiple</code>, a <code>question</code> string, and an <code>answers</code> array. Each answer object gets a <code>value</code> and a <code>label</code>. TODO: describe type <code>drawing</code>.</p>
          <JSONEditor name="tasks" placeholder={JSON.stringify DEFAULT_TASKS, null, 2} value={wizardData.tasks} onChange={@handleInputChange} rows={20} cols={80} />
        </div>
      </Route>

      <Route path="/build/new-project/review">
        <div className="content-container">
          <h2>Review and complete</h2>
          <table>
            <tr>
              <td>{<i className="fa fa-check"></i> if wizardData.name and wizardData.introduction and wizardData.description}</td>
              <td>Name, introduction, description</td>
            </tr>
            <tr>
              <td>{<i className="fa fa-check"></i> if wizardData.scienceCase}</td>
              <td>Science case</td>
            </tr>
            <tr>
              <td>{Object.keys(wizardData.subjects).length}</td>
              <td>Subjects</td>
            </tr>
            <tr>
              <td>{try Object.keys(JSON.parse wizardData.tasks).length catch then <i className="fa fa-times form-help error"></i>}</td>
              <td>Workflow tasks</td>
            </tr>
          </table>

          <p><button type="submit" onClick={@handleSubmit}>Create project and upload subject images</button></p>
        </div>
      </Route>

      <Route path="/build/new-project/progress">
        <div className="content-container">
          <table>
            <tr>
              <td>
                {<i className="fa fa-refresh fa-spin fa-fw"></i> if @state.savingProject}
                {<i className="fa fa-check fa-fw"></i> if @state.savedProject}
              </td>
              <td>Project</td>
            </tr>
            <tr>
              <td>
                {<i className="fa fa-refresh fa-spin fa-fw"></i> if @state.savingWorkflow}
                {<i className="fa fa-check fa-fw"></i> if @state.savedWorkflow}
              </td>
              <td>Workflow</td>
            </tr>
            <tr>
              <td>
                {<i className="fa fa-refresh fa-spin fa-fw"></i> if @state.savingSubjectSet}
                {<i className="fa fa-check fa-fw"></i> if @state.savedSubjectSet}
              </td>
              <td>Subject set</td>
            </tr>
            <tr>
              <td>
                {<i className="fa fa-refresh fa-spin fa-fw"></i> if @state.savingSubjects}
                {<i className="fa fa-check fa-fw"></i> if @state.savedSubjects}
              </td>
              <td>Subjects ({0} of {Object.keys(wizardData.subjects).length})</td>
            </tr>
          </table>
        </div>
      </Route>
    </div>

  _getSubjects: window._getSubjects = ->
    missing = []
    loose = []
    inManifest = []

    manifestedSubjectFilenames = []

    for manifest, subjects of wizardData.manifests
      for metadata in subjects
        manifestedSubjectFilenames.push metadata.filenames...

        files = (wizardData.subjects[filename] ? null for filename in metadata.filenames)
        if null in files
          missing.push {files, metadata}
        else
          inManifest.push {files, metadata}

    for filename, file of wizardData.subjects when filename not in manifestedSubjectFilenames
      files = [file]
      loose.push {files}

    [missing..., loose..., inManifest...]

  _renderSubjectRows: ->
    manifests = Object.keys(wizardData.manifests).length isnt 0

    for {files, metadata} in @_getSubjects()
      filenames = metadata?.filenames ? (name for {name} in files)

      <tr key={filenames.join()}>
        <td>
          {for filename, i in filenames
            <div>
              {filename}
              {unless files[i]?
                <span className="form-help error" title="Missing image">&nbsp;<i className="fa fa-exclamation-circle"></i></span>}
            </div>}
          {if manifests and not metadata?
            <div className="form-help warning"><i className="fa fa-exclamation-triangle"></i> Not present in any manifest</div>}
        </td>

        {for column in MANIFEST_COLUMNS[1...]
          <td>{metadata?[column] ? <span className="form-help">?</span>}</td>}

        <td>
          <button onClick={@removeSubjects.bind this, filenames...}>&times;</button>
        </td>
      </tr>

  handleInputChange: (e) ->
    valueProperty = switch e.target.type
      when 'radio', 'checkbox' then 'checked'
      when 'file' then 'files'
      else 'value'

    changes = {}
    changes[e.target.name] = e.target[valueProperty]

    wizardData.update changes

  removeSubjects: (filenames...) ->
    for filename in filenames
      delete wizardData.subjects[filename]
    wizardData.emitChange()

  removeManifest: (filename) ->
    delete wizardData.manifests[filename]
    wizardData.emitChange()

  handleSubjectFilesSelection: (e) ->
    thingsBeingProcessed = for file in e.target.files
      if file.type in ['text/csv', 'text/tab-separated-values']
        @_applyManifest file
      else if file.type.indexOf('image/') is 0
        wizardData.subjects[file.name] = file

    Promise.all(thingsBeingProcessed).then =>
      wizardData.emitChange()

  _applyManifest: (file) ->
    newlines = /\n|\r\n|\r/

    columnDelimiter = switch file.type
      # TODO: Parse these files properly.
      when 'text/csv' then  ','
      when 'text/tab-separated-values' then '\t'

    listDelimeter = ';'

    new Promise (resolve) =>
      reader = new FileReader
      reader.onload = =>
        wizardData.manifests[file.name] ?= []
        for line in reader.result.split newlines when line
          metadataInOrder = line.split columnDelimiter

          metadata = {}
          for key, i in MANIFEST_COLUMNS when metadataInOrder[i]?
            metadata[key] = metadataInOrder[i]

          if metadata.filenames?
            metadata.filenames = metadata.filenames.split listDelimeter

          for imageFilename in metadata.filenames
            wizardData.manifests[file.name].push metadata

        resolve()

      reader.readAsText file

  handleSubmit: ->
    @_saveProject().then (project) =>
      @_saveSubjectSet(project).then (subjectSet) =>
        @_saveWorkflow(project, subjectSet).then (workflow) =>
          @_saveSubjects(project).then (subjects) =>
            console.group 'Created!'
            console.info 'project', project
            console.info 'subjectSet', subjectSet
            console.info 'workflow', workflow
            console.info 'subjects', subjects
            console.groupEnd()

  _saveProject: ->
    {language: primary_language, name: display_name, introduction, description, scienceCase: science_case} = wizardData
    projectData = {primary_language, display_name, introduction, description, science_case}

    project = apiClient.createType('projects').createResource projectData
    project.save()

  _saveSubjectSet: (project) ->
    subjectSetData =
      display_name: "#{project.display_name} initial subjects"
      links:
        project: project.id

    subjectSet = apiClient.createType('subject_sets').createResource subjectSetData
    subjectSet.save()

  _saveWorkflow: (project, subjectSet) ->
    workflowData =
      display_name: "#{project.display_name} default workflow"
      tasks: JSON.parse wizardData.tasks
      primary_language: project.available_languages[0]
      links:
        project: project.id
        subject_sets: [subjectSet.id]

    workflow = apiClient.createType('workflows').createResource workflowData
    workflow.save()

  _saveSubjects: window.saveSubjects = (project) ->
    subjectsToSave = (subject for subject in @_getSubjects() when null not in subject.files?)

    sharedSubjectLinks =
      project: project.id

    for {files, metadata} in subjectsToSave
      metadata ?=
        filenames: (name for {name} in files)

      subjectData =
        locations: (type for {type} in files)

        # metadata: metadata # FIXME: Metadata should be free-form.

        links: sharedSubjectLinks

      subject = apiClient.createType('subjects').createResource subjectData
      subject.save().then (subject) =>
        window.subject = subject
        @_uploadSubjectFiles subject, files

  _uploadSubjectFiles: window._uploadSubjectFiles = (subject, files) ->
    a = document.createElement 'a'

    for location, i in subject.locations
      for type, src of location then do (i, src) ->
        a = document.createElement 'a'
        a.href = src

        destination = a.protocol + a.host + a.pathname

        xhr = new XMLHttpRequest
        xhr.open 'PUT', destination

        formData = new FormData
        a.search.slice(1).split('&').forEach (keyAndValue) ->
          [key, value] = keyAndValue.split('=').map decodeURIComponent
          formData.append key, value
        formData.append 'file', files[i]

        xhr.send formData
