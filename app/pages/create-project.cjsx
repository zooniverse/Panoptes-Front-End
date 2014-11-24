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
        <h1>Create a new project</h1>
        <h2>General information</h2>
        <p>Name: <input type="text" name="display_name" placeholder="Project name" value={newProjectData.display_name} onChange={@handleProjectInputChange} /></p>
        <p>Introduction: <input type="text" name="introduction" placeholder="A catchy slogan for the project" value={newProjectData.introduction} onChange={@handleProjectInputChange} /></p>
        <p>TODO: Avatar</p>

        <hr />

        <h2>Describe your project</h2>
        <p><MarkdownEditor name="description" placeholder="Why is this project interesting?" value={newProjectData.description} onChange={@handleProjectInputChange} /></p>
        <hr />

        <h2>Explain your science case</h2>
        <p><MarkdownEditor name="science_case" placeholder="A more detailed explanation of what you hope to acheive with the data you collect" value={newProjectData.science_case} onChange={@handleProjectInputChange} /></p>

        <hr />

        <h2>Upload some example images</h2>
        <p>TODO</p>
        <p>You’ll be able to pick multiple files in the file picker:</p>
        <p><input type="file" multiple="multiple" name="example_images" onChange={@handleProjectInputChange} disabled="disabled" /></p>
        <ul>
          {<li key={file.name}>{file.name}</li> for file in newProjectData.example_images ? []}
        </ul>

        <hr />

        <h2>Define the classification workflow</h2>
        <p><input type="text" name="name" placeholder={newProjectData.display_name + ' main workflow'} value={newWorkflowData.name} onChange={@handleWorkflowInputChange} required="required" /></p>
        <p><JSONEditor name="tasks" placeholder={JSON.stringify TASKS_PLACEHOLDER, null, 2} value={newWorkflowData.tasks} onChange={@handleWorkflowInputChange} rows={20} cols={80} /></p>
        <p>You’ll be able to edit this and define more workflows a bit later.</p>

        <hr />

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

        <button type="submit" onClick={@handleSubmit}>Create</button>
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
            alert <p>Error saving workflow: <br /><code>{errors}</code></p>

      .catch (errors) ->
        alert <p>Error saving project: <br /><code>{errors}</code></p>
