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

            Results<br />
            <MarkdownEditor name="result" value={@props.project.result} onChange={handleProjectChange} /><br />

            FAQ<br />
            <MarkdownEditor name="faq" value={@props.project.faq} onChange={handleProjectChange} /><br />

            Education resources<br />
            <MarkdownEditor name="education_content" value={@props.project.education_content} onChange={handleProjectChange} /><br />

            Workflows<br />
            <ul>
              {if @state.workflows?
                for workflow in @state.workflows
                  <ChangeListener key={workflow.id} target={workflow}>{=>
                    <li><Link to="edit-workflow" params={id: workflow.id}>{workflow.display_name}</Link></li>
                  }</ChangeListener>
              else
                <p>Couldn’t load workflows!</p>}
            </ul>

            <p>
              <label>
                <input type="checkbox" name="private" checked={@props.project.private} onChange={handleProjectChange} /> Private
              </label>
            </p>

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
    <ChangeListener target={auth}>{=>
      getProject = auth.checkCurrent().then =>
        apiClient.type('projects').get(@props.params.id).then (project) ->
          project.refresh()

      <PromiseRenderer promise={getProject}>{(project) ->
        <ProjectEditPage project={project} />
      }</PromiseRenderer>
    }</ChangeListener>
