# @cjsx React.DOM

React = require 'react'
Model = require '../data/model'
InPlaceForm = require '../components/in-place-form'
MarkdownEditor = require '../components/markdown-editor'

languages = ['en-us']

newProjectData = new Model
  name: ''
  description: ''
  language: languages[0]

module.exports = React.createClass
  displayName: 'CreateProjectPage'

  componentDidMount: ->
    newProjectData.listen @handleProjectChange

  componentWillUnmount: ->
    newProjectData.stopListening @handleProjectChange

  handleProjectChange: ->
    @forceUpdate()

  render: ->
    <div className="create-project-page">
      <div className="content-container">
        <h1>Create a new project</h1>
        <h2>General information</h2>
        <p>Name: <input type="text" name="name" placeholder="Project name" value={newProjectData.name} onChange={@handleInputChange} /></p>
        <p>Description: <MarkdownEditor name="description" placeholder="A brief description of the project" value={newProjectData.description} onChange={@handleInputChange} /></p>
        <p>TODO: Avatar</p>

        <hr />

        <h2>Explain your science case</h2>
        <p>TODO: Science case:</p>
        <p><MarkdownEditor name="science_case" placeholder="A more detailed explanation of what you hope to acheive with the data you collect" value={newProjectData.science_case} onChange={@handleInputChange} /></p>

        <hr />

        <h2>Upload some example images</h2>
        <p>You’ll be able to pick multiple files in the file picker:</p>
        <input type="file" multiple="multiple" name="example_images" onChange={@handleInputChange} />

        <hr />

        <h2>Define the classification workflow</h2>
        <p>TODO</p>

        <hr />

        <h2>Review and complete</h2>
        <table>
          <tr>
            <td>{<i className="fa fa-check"></i> if newProjectData.name}</td>
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
            <td>{<i className="fa fa-check"></i> if newProjectData.example_images}</td>
            <td>Example images</td>
          </tr>
        </table>

        <button type="submit" onClick={@handleSubmit}>Create</button>
      </div>
    </div>

  handleInputChange: (e) ->
    console.log 'Changed', e.target
    changes = new -> @[e.target.name] = e.target.value
    newProjectData.update changes

  handleSubmit: ->
    console.log 'Create a project with these values', JSON.stringify newProjectData
