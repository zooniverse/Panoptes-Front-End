React = require 'react'
Model = require '../lib/model'
ChangeListener = require '../components/change-listener'
MarkdownEditor = require '../components/markdown-editor'
JSONEditor = require '../components/json-editor'
apiClient = require '../api/client'

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
  tasks: JSON.stringify DEFAULT_TASKS, null, 2

wizardData = new Model
  refresh: ->
    wizardData.update JSON.parse JSON.stringify DEFAULT_DATA

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

module.exports = React.createClass
  displayName: 'CreateProjectPage'

  getInitialState: ->
    step: 'general'

  render: ->
    <ChangeListener target={wizardData} handler={@renderWizard} />

  renderWizard: ->
    <div className="create-project-page">
      {switch @state.step
        when 'general'
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

        when 'science'
          <div className="content-container">
            <h2>Science case</h2>
            <fieldset>
              <MarkdownEditor name="scienceCase" placeholder="A more detailed explanation of what you hope to achieve with the data you collect" value={wizardData.scienceCase} onChange={@handleInputChange} />
              <span /><div className="form-help">Tell people how the data you collect will be used. What is the expected output of this project?</div>
            </fieldset>
          </div>

        when 'subjects'
          <div className="content-container">
            <h2>Create a set of subjects</h2>
            <p>Now you’ll be able to choose the images you want volunteers to look at (JPEG, PNG, or GIF, please). Optionally, you can include metadata about the images with a manifest file <small>(TODO: describe the manifest)</small>.</p>
            <p>These images will be uploaded during after last step of this process, which could take a long time depending on how many you select. Make sure you’ve got a steady internet connection. You’ll have an opportunity to review and refine your selection here before continuing.</p>

            <table>
              <thead>
                <tr>
                  <th></th>
                  {<th>{column}</th> for column in MANIFEST_COLUMNS[1...]}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {@_renderSubjectRows()}
              </tbody>
            </table>

            <p><input type="file" accept="image/*,text/tab-separated-values" multiple="multiple" onChange={@handleSubjectFilesSelection} /></p>
          </div>

        when 'workflow'
          <div className="content-container">
            <h2>Define the classification workflow</h2>
            <p>Now you’ll define and link together the tasks each volunteer will do to complete a classification. <small>TODO: This is done in raw JSON for now.</small></p>
            <p className="form-help">Each task object gets a <code>type</code> of <code>single</code> or <code>multiple</code>, a <code>question</code> string, and an <code>answers</code> array. Each answer object gets a <code>value</code> and a <code>label</code>. TODO: describe type <code>drawing</code>.</p>
            <JSONEditor name="tasks" placeholder={JSON.stringify DEFAULT_TASKS, null, 2} value={wizardData.tasks} onChange={@handleInputChange} rows={20} cols={80} />
          </div>

        when 'review'
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

        when 'progress'
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
          </div>}

      <nav className="wizard-steps content-container">
        <button className={'active' if @state.step is 'general'} onClick={@setState.bind this, step: 'general', null}>
          General
          <StepStatusIcon completed={wizardData.name and wizardData.introduction and wizardData.description} />
        </button>

        <button className={'active' if @state.step is 'science'} onClick={@setState.bind this, step: 'science', null}>
          Science case
          <StepStatusIcon completed={wizardData.scienceCase} />
        </button>

        <button className={'active' if @state.step is 'subjects'} onClick={@setState.bind this, step: 'subjects', null}>
          Subjects
          <StepStatusIcon completed={Object.keys(wizardData.subjects).length isnt 0} />
        </button>

        <button className={'active' if @state.step is 'workflow'} onClick={@setState.bind this, step: 'workflow', null}>
          Workflow
          <StepStatusIcon completed={wizardData.workflow} />
        </button>

        <button className={'active' if @state.step is 'review'} onClick={@setState.bind this, step: 'review', null}>
          Review
        </button>
      </nav>
    </div>

  _renderSubjectRows: ->
    for filename, {metadata} of wizardData.subjects
      <tr key={filename}>
        <td><strong>{filename}</strong></td>
        {for column in MANIFEST_COLUMNS
          <td title={column}>{metadata?[column] ? <span className="form-help">?</span>}</td>}

        <td>
          {<button onClick={@removeSubject.bind this, filename}><i className="fa fa-times"></i></button>}
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

  removeSubject: (filename) ->
    delete wizardData.subjects[filename]
    wizardData.emitChange()

  handleSubjectFilesSelection: (e) ->
    thingsBeingProcessed = for file in e.target.files
      if file.type in ['text/csv', 'text/tab-separated-values']
        @_applyManifest file
      else if file.type.indexOf('image') is 0
        wizardData.subjects[file.name] ?= {}
        wizardData.subjects[file.name].file = file

    Promise.all(thingsBeingProcessed).then =>
      wizardData.emitChange()

  _applyManifest: (file) ->
    newlines = /\n|\r\n|\r/

    delimeters = switch file.type
      when 'text/csv' then  ','
      when 'text/tab-separated-values' then '\t'

    new Promise (resolve) =>
      reader = new FileReader

      reader.onload = =>
        for line in reader.result.split newlines when line
          metadata = line.split delimeters
          wizardData.subjects[metadata.filenames] ?= {}
          wizardData.subjects[metadata.filenames].metadata = {}
          for key, i in MANIFEST_COLUMNS when metadata[i]?
            wizardData.subjects[metadata.filenames].metadata[key] = metadata[i]
        resolve()

      reader.readAsText file

  handleSubmit: ->
    @_saveProject().then (project) =>
      @_saveWorkflow(project).then (workflow) =>
        @_saveSubjectSet(project, workflow).then (subjectSet) =>
          @_saveSubjects(project, subjectSet).then =>
            console.group 'Created!'
            console.info 'project', project
            console.info 'workflow', workflow
            console.info 'subjectSet', subjectSet
            console.groupEnd()

  _saveProject: ->
    {language: primary_language, name: display_name, introduction, description, scienceCase: science_case} = wizardData
    projectData = {primary_language, display_name, introduction, description, science_case}

    project = apiClient.createType('projects').createResource projectData
    project.save()

  _saveWorkflow: (project) ->
    workflowData =
      name: "#{project.display_name} default workflow"
      tasks: JSON.parse wizardData.tasks
      primary_language: project.available_languages[0]
      links:
        project: project.id

    workflow = apiClient.createType('workflows').createResource workflowData
    workflow.save()

  _saveSubjectSet: (project, workflow) ->
    subjectSetData =
      name: "#{project.display_name} initial subjects"
      links:
        project: project.id
        workflows: [workflow.id]

    subjectSet = apiClient.createType('subject_sets').createResource subjectSetData
    subjectSet.save()

  _saveSubjects: (project, subjectSet) ->
    # sharedSubjectLinks =
    #   project: project.id
    #   subject_set: subjectSet.id

    # subjects = for filename, metadata in wizardData.subjects
    #   subjectData =
    #     locations:
    #       standard:
    #     metadata: metadata
    #     links: Object.create sharedSubjectLinks
    #   subject = apiClient.createType('subject_sets').createResource subjectSetData
    #   subject.save().then (subject) ->
    #     subject.locations

    # _saveSubject: (file, subjectSet) ->
