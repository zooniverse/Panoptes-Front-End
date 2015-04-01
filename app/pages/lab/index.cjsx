React = require 'react'
{Link, Navigation} = require 'react-router'
PromiseRenderer = require '../../components/promise-renderer'
LoadingIndicator = require '../../components/loading-indicator'
apiClient = require '../../api/client'
counterpart = require 'counterpart'

RequiresSession = do ->
  ChangeListener = require '../../components/change-listener'
  auth = require '../../api/auth'
  PromiseRenderer = require '../../components/promise-renderer'

  React.createClass
    displayName: 'RequiresSession'

    render: ->
      <ChangeListener target={auth} handler={@renderAuth} />

    renderAuth: ->
      <PromiseRenderer promise={auth.checkCurrent()} then={@renderUser} />

    renderUser: (user) ->
      if user?
        @props.render user
      else
        <span>You’re not signed in.</span>

sleep = (duration) ->
  (value) ->
    new Promise (resolve) ->
      setTimeout resolve.bind(null, value), duration

module.exports = React.createClass
  displayName: 'LabIndex'

  mixins: [Navigation]

  getInitialState: ->
    projects: []
    creationError: null
    creationInProgress: false

  render: ->
    <div className="content-container">
      <RequiresSession render={@renderWithSession} />
    </div>

  renderWithSession: (user) ->
    # TODO: Make this a component instead of a function,
    # then `user.uncacheLink 'projects'` on mount and on project creation.

    getProjects = user.get 'projects', skipCache: true
      .then (projects) ->
        refreshedProjects = for project in projects
          project.refresh()
        Promise.all refreshedProjects

    <div>
      <p>Projects owned by {user.display_name}:</p>
      <PromiseRenderer promise={getProjects} then={@renderProjects.bind this, user} />
      <br />
      <button className="standard-button" disabled={@state.creationInProgress} onClick={@createNewProject.bind this, user}>
        Create a new project{' '}
        <LoadingIndicator off={not @state.creationInProgress} />
      </button>&nbsp;
      {if @state.creationError?
        <p className="form-help error">{@state.creationError.message}</p>}
    </div>

  renderProjects: (user, projects) ->
    <table>
      {for project in projects
        <tr key={project.id}>
          <td>{project.display_name}</td>
          <td><Link to="edit-project-details" params={projectID: project.id} className="minor-button"><i className="fa fa-pencil"></i> Edit</Link></td>
          <td><Link to="project-home" params={owner: user.display_name, name: project.display_name} className="minor-button"><i className="fa fa-hand-o-right"></i> View</Link></td>
        </tr>}
    </table>

  createNewProject: (user) ->
    project = apiClient.type('projects').create
      display_name: 'Untitled project'
      description: 'Description of project'
      primary_language: counterpart.getLocale()
      private: true

    @setState
      creationError: null
      creationInProgress: true

    project.save()
      .catch (error) =>
        @setState creationError: error
      .then sleep 1100 # Wait for the global request cache to clear (TODO: Cache should really expire on return).
      .then (project) =>
        # TODO: user.uncacheLink 'project'
        @setState creationInProgress: false
        @transitionTo 'edit-project-details', projectID: project.id
