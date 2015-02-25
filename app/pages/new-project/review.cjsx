React = require 'react'
data = require './data'
apiClient = require '../../api/client'

module.exports = React.createClass
  displayName: 'NewProjectReviewPage'

  getInitialState: ->
    log: []

  render: ->
    subjectsCount = Object.keys(data.subjects).length
    workflowTasks = try Object.keys(JSON.parse data.tasks).length

    <div className="content-container">
      <h2>Review and complete</h2>
      <table>
        <tr>
          <td>{<i className="fa fa-check"></i> if data.name and data.introduction and data.description and data.scienceCase}</td>
          <td>General info and science case</td>
        </tr>
        <tr>
          <td>{if subjectsCount is 0
            <span style={color: 'red'}>{subjectsCount}</span>
          else
            subjectsCount}</td>
          <td>Subjects</td>
        </tr>
        <tr>
          <td>{workflowTasks ? <i className="fa fa-times form-help error"></i>}</td>
          <td>Workflow tasks</td>
        </tr>
      </table>

      <p>
        <button onClick={@submitData}>Create project</button>
      </p>

      <ul>
        {for line, i in @state.log
          if line instanceof Error
            <li key={i} style={color: 'red'}>{line.toString()}</li>
          else
            <li key={i}>{line}</li>}
      </ul>
    </div>

  submitData: ->
    @_saveProject().then (project) =>
      console?.info 'project', project
      @_saveSubjectSet(project).then (subjectSet) =>
        console?.info 'subjectSet', subjectSet
        @_saveWorkflow(project, subjectSet).then (workflow) =>
          console?.info 'workflow', workflow
          @_saveSubjects(project).then (subjects) =>
            console?.info 'subjects', subjects
            @_linkSubjectSet(subjectSet, subjects)

  _saveProject: ->
    @setState log: @state.log.concat ['Saving project']
    {language: primary_language, name, introduction, description, scienceCase: science_case} = data
    projectData = {primary_language, display_name: name, introduction, description, science_case, private: true}

    project = apiClient.type('projects').create projectData
    project.save()
      .then =>
        @setState log: @state.log.concat ['Saved project']
        project
      .catch =>
        @setState log: @state.log.concat [new Error 'Failed to save project!']

  _saveSubjectSet: (project) ->
    @setState log: @state.log.concat ['Saving subject set']
    subjectSetData =
      display_name: "#{project.display_name} initial subjects"
      links:
        project: project.id

    subjectSet = apiClient.type('subject_sets').create subjectSetData
    subjectSet.save()
      .then =>
        @setState log: @state.log.concat ['Saved subject set']
        subjectSet
      .catch =>
        @setState log: @state.log.concat [new Error 'Failed to save subject set!']

  _saveWorkflow: (project, subjectSet) ->
    @setState log: @state.log.concat ['Saving workflow']
    workflowData =
      display_name: "#{project.display_name} default workflow"
      first_task: Object.keys(JSON.parse data.tasks)[0]
      tasks: JSON.parse data.tasks
      primary_language: project.available_languages[0]
      links:
        project: project.id
        subject_sets: [subjectSet.id]

    workflow = apiClient.type('workflows').create workflowData
    workflow.save()
      .then =>
        @setState log: @state.log.concat ['Saved workflow']
        workflow
      .catch =>
        @setState log: @state.log.concat [new Error 'Failed to save workflow!']

  _saveSubjects: (project) ->
    subjectsToSave = (subject for subject in data.getSubjects() when null not in subject.files)

    sharedSubjectLinks =
      project: project.id

    subjectSaves = for {files, metadata} in subjectsToSave then do (files, metadata) =>
      metadata ?=
        filenames: (name for {name} in files)

      subjectData =
        locations: (type for {type} in files)
        # metadata: metadata
        links: sharedSubjectLinks

      subject = apiClient.type('subjects').create subjectData

      subjectFilesString = (name for {name} in files).join ', '
      @setState log: @state.log.concat ["Saving subject #{subjectFilesString}"]
      subject.save()
        .then (subject) =>
          @setState log: @state.log.concat ["Saved subject #{subjectFilesString}"]
          @_uploadSubjectFiles subject, files
          subject
        .catch =>
          @setState log: @state.log.concat [new Error "Failed to save subject #{subjectFilesString}!"]

    Promise.all subjectSaves

  _uploadSubjectFiles: (subject, files) ->
    uploads = []
    for location, i in subject.locations
      for type, src of location
        uploads.push @_putFile src, files[i]

    Promise.all uploads

  _putFile: (location, file) ->
    @setState log: @state.log.concat ["Uploading #{file.name}"]
    new Promise (resolve, reject) =>
      xhr = new XMLHttpRequest

      xhr.onreadystatechange = (e) =>
        if e.target.readyState is e.target.DONE
          resolver = if 200 <= e.target.status < 300
            @setState log: @state.log.concat ["Uploaded #{file.name}"]
            resolve
          else
            @setState log: @state.log.concat [new Error "Failed to upload #{file.name}!"]
            reject
          resolver e.target

      xhr.open 'PUT', location
      xhr.send file

  _linkSubjectSet: (subjectSet, subjects) ->
    @setState log: @state.log.concat ["Linking #{subjects.length} subjects to subject set"]
    subjectSet.update links: Object.create subjectSet.links # HACK
    subjectSet.links.subjects ?= []
    subjectSet.links.subjects.push (id for {id} in subjects)...

    subjectSet.save()
      .then (subjectSet) =>
        @setState log: @state.log.concat ["Linked #{subjects.length} subject(s)"]
        subjectSet
      .catch =>
        @setState log: @state.log.concat [new Error "Failed to link #{subjects.length} subjects!"]
