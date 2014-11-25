React = require 'react'
Model = require '../lib/model'
apiClient = require '../api/client'
InPlaceForm = require '../components/in-place-form'
MarkdownEditor = require '../components/markdown-editor'
JSONEditor = require '../components/json-editor'
alert = require '../lib/alert'

TASKS_PLACEHOLDER =
  is_cool: {
    type: 'single'
    question: 'Is this image cool?'
    answers: [{
      value: true
      label: 'Yes!'
    }, {
      value: false
      label: 'Nope'
    }]
  }

languages = ['en-us']

newProjectData = new Model
  display_name: 'Something Zoo'
  introduction: 'Welcome to the Something Zoo'
  description: 'Here is a description.'
  science_case: 'Here is some science.'
  primary_language: languages[0]

newWorkflowData = new Model
  name: 'Something Zoo main workflow'
  tasks: JSON.stringify TASKS_PLACEHOLDER, null, 2
  primary_language: languages[0]

newSubjectSet = new Model
  name: 'Something Zoo main subjects'
  subjects: []

module.exports = React.createClass
  displayName: 'CreateProjectPage'

  componentDidMount: ->
    newProjectData.listen @handleProjectChange
    newWorkflowData.listen @handleProjectChange

  componentWillUnmount: ->
    newProjectData.stopListening @handleProjectChange
    newWorkflowData.stopListening @handleProjectChange

  handleProjectChange: ->
    @forceUpdate()

  render: ->
    <div className="create-project-page">
      <div className="content-container">
        <h2>General information</h2>
        <div className="columns-container">
          <div className="column">
            <p>Project name<br /><input type="text" name="display_name" placeholder="Project name" value={newProjectData.display_name} onChange={@handleProjectInputChange} style={width: '100%'} /></p>
            <p>Tagline<br /><input type="text" name="introduction" placeholder="A catchy slogan for the project" value={newProjectData.introduction} onChange={@handleProjectInputChange} style={width: '100%'} /></p>
          </div>
          <hr />
          <div>
            <p>Avatar <small>(TODO)</small></p>
            <div className="avatar-chooser">
              <button type="button"><i className="fa fa-times fa-fw"></i></button>
              <button type="button"><i className="fa fa-file-image-o fa-fw"></i></button>
            </div>
          </div>
        </div>
        <hr />
        <p>Project description<br /><MarkdownEditor name="description" placeholder="Why is this project interesting?" value={newProjectData.description} onChange={@handleProjectInputChange} style={width: '100%'} /></p>
      </div>

      <hr />

      <div className="content-container">
        <h2>Explain your science case</h2>
        <p><MarkdownEditor name="science_case" placeholder="A more detailed explanation of what you hope to acheive with the data you collect" value={newProjectData.science_case} onChange={@handleProjectInputChange} /></p>
      </div>

      <hr />

      <div className="content-container">
        <h2>Create a set of subjects</h2>
        <p>Upload image files and an optional manifest TSV:</p>
        <p><input type="file" name="example_images" accept="image/*,text/tab-separated-values" multiple="multiple" onChange={@handleSubjectFilesSelection} /></p>

        <table>
          <thead>
            <tr><th>File name</th><th>Full width</th><th>Full height</th><th>Latitude</th><th>Longitude</th></tr>
          </thead>
          <tbody>
            {if [].length is 0
              <tr><td colSpan="5" className="form-help" style={textAlign: 'center'}><i>No subjects selected</i></td></tr>
            else
              <tr><td key={file.name}>{file.name}</td></tr> for file in []}
          </tbody>
        </table>
      </div>

      <hr />

      <div className="content-container">
        <h2>Define the classification workflow</h2>
        <p>Name: <input type="text" name="name" placeholder={newProjectData.display_name + ' main workflow'} value={newWorkflowData.name} onChange={@handleWorkflowInputChange} required="required" /></p>
        <p>Tasks: <JSONEditor name="tasks" placeholder={JSON.stringify TASKS_PLACEHOLDER, null, 2} value={newWorkflowData.tasks} onChange={@handleWorkflowInputChange} rows={20} cols={80} /></p>
        <p>You’ll be able to edit this and define more workflows a bit later.</p>
      </div>

      <hr />

      <div className="content-container">
        <h2>Review and complete</h2>
        <table>
          <tr>
            <td>{<i className="fa fa-check"></i> if newProjectData.display_name}</td>
            <td>Name</td>
          </tr>
          <tr>
            <td>{<i className="fa fa-check"></i> if newProjectData.description}</td>
            <td>Description</td>
          </tr>
          <tr>
            <td>{<i className="fa fa-check"></i> if newProjectData.science_case}</td>
            <td>Science case</td>
          </tr>
          <tr>
            <td>{<i className="fa fa-check"></i> if newProjectData.example_images?.length isnt 0}</td>
            <td>Example images</td>
          </tr>
        </table>

        <p><button type="submit" onClick={@handleSubmit}>Create project and upload subject images</button></p>
      </div>
    </div>

  handleProjectInputChange: ->
    @_handleInputChange newProjectData, arguments...

  handleWorkflowInputChange: ->
    @_handleInputChange newWorkflowData, arguments...

  _handleInputChange: (model, e) ->
    valueProperty = switch e.target.type
      when 'radio', 'checkbox' then 'checked'
      when 'file' then 'files'
      else 'value'

    changes = {}
    changes[e.target.name] = e.target[valueProperty]

    model.update changes

  handleSubjectFilesSelection: (e) ->
    manifest = null
    images = []

    for file in e.target.files
      if file.type is 'text/tab-separated-values'
        manifest = file
      else if file.type.indexOf 'image' is 0
        images.push file

    console.log manifest, images

    # reader = new FileReader
    # reader.onload = (e) ->
    #   data = for line in reader.result.split '\n' when line
    #     (value for value in line.split '\t')

    #   console.info 'Read TSV', data

    # reader.readAsText manifest

  handleSubmit: ->
    projectData = JSON.parse JSON.stringify newProjectData
    project = apiClient.createType('projects').createResource projectData
    project.save()
      .then (project) ->
        workflowData = JSON.parse JSON.stringify newWorkflowData
        workflowData.tasks = JSON.parse workflowData.tasks
        workflowData.links = project: project.id
        workflow = apiClient.createType('workflows').createResource workflowData
        workflow.save()
          .then (workflow) =>
            console?.info 'Saved a project and a workflow', project, workflow
            # location.hash = '/build/edit-project/' + project.id

          .catch (errors) ->
            alert <p>Error saving workflow:<br /><code>{errors}</code></p>

      .catch (errors) ->
        alert <p>Error saving project:<br /><code>{errors}</code></p>
