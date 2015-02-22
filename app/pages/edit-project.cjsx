React = require 'react'
HandlePropChanges = require '../lib/handle-prop-changes'
PromiseToSetState = require '../lib/promise-to-set-state'
ChangeListener = require '../components/change-listener'
auth = require '../api/auth'
PromiseRenderer = require '../components/promise-renderer'
InPlaceForm = require '../components/in-place-form'
handleInputChange = require '../lib/handle-input-change'
MarkdownEditor = require '../components/markdown-editor'
{Link} = require 'react-router'
apiClient = require '../api/client'

ProjectEditPage = React.createClass
  displayName: 'EditProjectPage'

  mixins: [HandlePropChanges, PromiseToSetState]

  getDefaultProps: ->
    project: null

  getInitialState: ->
    workflows: []
    busy: false

  propChangeHandlers:
    project: (project) ->
      @promiseToSetState workflows: project.get 'workflows', skipCache: true

  render: ->
    handleProjectChange = handleInputChange.bind @props.project

    currentAndOwner = Promise.all [
      auth.checkCurrent()
      @props.project.get 'owner'
    ]

    <PromiseRenderer promise={currentAndOwner}>{([currentUser, projectOwner] = []) =>
      if projectOwner? and currentUser is projectOwner
        <ChangeListener target={@props.project}>{=>
          <InPlaceForm onSubmit={@handleSubmit}>
            Name<br />
            <input type="text" name="display_name" value={@props.project.display_name} onChange={handleProjectChange} /><br />

            Description<br />
            <MarkdownEditor name="description" value={@props.project.description} onChange={handleProjectChange} /><br />

            Introduction<br />
            <MarkdownEditor name="introduction" value={@props.project.introduction} onChange={handleProjectChange} /><br />

            Science case<br />
            <MarkdownEditor name="science_case" value={@props.project.science_case} onChange={handleProjectChange} /><br />

            Workflows<br />
            <ul>
              {for workflow in @state.workflows
                <ChangeListener key={workflow.id} target={workflow}>{=>
                  <li><Link to="edit-workflow" params={id: workflow.id}>{workflow.display_name}</Link></li>
                }</ChangeListener>}
            </ul>

            <button type="submit" disabled={@state.busy or not @props.project.hasUnsavedChanges()}>Save</button><br />
            <button type="button" onClick={@handleDelete}>Delete this project</button><br />
          </InPlaceForm>
        }</ChangeListener>

      else
        <p>Checking permissions</p>
    }</PromiseRenderer>

  handleSubmit: ->
    @setState busy: true
    @props.project.save().then =>
      @setState busy: false

  handleDelete: ->
    if prompt('Enter REALLY to delete this project forever.')?.toUpperCase() is 'REALLY'
      @setState busy: true
      @props.project.delete().then =>
        @setState busy: false

module.exports = React.createClass
  displayName: 'EditProjectPageWrapper'

  render: ->
    <div className="columns-container">
      <div>
        <ul>
          <li><a href="#">Project details</a></li>
          <li><a href="#">Science case</a></li>
          <li><a href="#">Results</a></li>
          <li><a href="#">Collaborators</a></li>
          <li>
            <header>Workflows</header>
            <ul>
              <li><a href="#">Get started</a></li>
              <li><button type="button">Create a new workflow</button></li>
            </ul>
          </li>
          <li>
            <header>Subject sets</header>
            <ul>
              <li><a href="#">Get started expert subjects</a></li>
              <li><a href="#">Get started initial subjects</a></li>
              <li><button type="button">Create a new subject set</button></li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="column">
        <div className="columns-container">
          <div>
            <div>
              Avatar <button type="button">&times;</button><br />
              <img src="//placehold.it/100x100.png" /><br />
              <input type="file" />
            </div>
            <div>
              Background image <button type="button">&times;</button><br />
              <img src="//placehold.it/100x75.png" /><br />
              <input type="file" />
            </div>
          </div>
          <div className="column">
            <div>
              Name<br />
              <input type="text" placeholder="Project name" />
            </div>
            <div>
              Description<br />
              <textarea />
            </div>
            <div>
              Introduction<br />
              <textarea />
            </div>
          </div>
        </div>
        <hr />
        <hr />
        <div>
          Science Case<br />
          <textarea />
        </div>
        <hr />
        <hr />
        <div>
          Results<br />
          <textarea />
        </div>
        <hr />
        <hr />
        <div>
          Collaborators<br />
          <table>
            <tr>
              <td>User name</td>
              <td><input type="checkbox" /> Admin</td>
              <td><input type="checkbox" /> Scientist</td>
              <td><input type="checkbox" /> Moderator</td>
              <td><input type="checkbox" /> Translator</td>
              <td><button type="button">&times;</button></td>
            </tr>
          </table>
          <div>
            <input type="text" /> <button type="button">Add collaborator</button>
          </div>
        </div>
        <hr />
        <hr />
        <div className="columns-container">
          <div>
            <div>
              Name<br />
              <input type="text" placeholder="Workflow name" />
            </div>
            <div>
              (Retirement rules editor)
            </div>
            <div>
              Associated subject sets
              <table>
                <tr>
                  <td><input type="checkbox" checked /></td>
                  <td>Subject set display name</td>
                </tr>
              </table>
            </div>
          </div>
          <div className="column">
            Tasks<br />
            (Workflow tasks editor)
          </div>
        </div>
        <hr />
        <hr />
        <div>
          Name<br />
          <input type="text" placeholder="Subject set name" /><br />
          (Subject set editor)<br />
          <input type="file" />
        </div>
      </div>
    </div>

  Xrender: ->
    <ChangeListener target={auth}>{=>
      getProject = auth.checkCurrent().then =>
        apiClient.type('projects').get(@props.params.id).then (project) ->
          project.refresh()

      <PromiseRenderer promise={getProject}>{(project) ->
        <ProjectEditPage project={project} />
      }</PromiseRenderer>
    }</ChangeListener>
