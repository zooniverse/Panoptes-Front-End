React = require 'react'
{Link, Navigation} = require 'react-router'
PromiseRenderer = require '../../components/promise-renderer'
LoadingIndicator = require '../../components/loading-indicator'
apiClient = require '../../api/client'
counterpart = require 'counterpart'
LandingPage = require './landing-page'

sleep = (duration) ->
  (value) ->
    new Promise (resolve) ->
      setTimeout resolve.bind(null, value), duration

module.exports = React.createClass
  displayName: 'LabIndex'
  mixins: [Navigation]

  getInitialState: ->
    page: 1
    creationError: null
    creationInProgress: false

  fetchProjects: ->
    projectsQuery =
      current_user_roles: 'owner,collaborator',
      page: @state.page
      skipCache: true

    apiClient.type('projects').get projectsQuery

  render: ->
    if @props.user?
      <PromiseRenderer promise={@fetchProjects()}>{(projects) =>
        if projects.length > 0
          <div className="content-container">
            <div>
              <table>
                <tbody>
                  {for project in projects then do (project) =>
                    [owner, name] = project.slug.split('/')
                    <tr key={project.id}>
                      <td>{project.display_name}</td>
                      <td><Link to="edit-project-details" params={projectID: project.id} className="minor-button"><i className="fa fa-pencil"></i> Edit</Link></td>
                      <td>
                        <Link to="project-home" params={owner: owner, name: name} className="minor-button"><i className="fa fa-hand-o-right"></i> View</Link>
                      </td>
                    </tr>}
                </tbody>
              </table>

              {meta = projects[0]?.getMeta()
              if meta? and meta.page_count isnt 1
                <nav className="pagination">
                  <label>
                    Page
                    {' '}
                    <select value={@state.page} onChange={@handlePageChange}>
                      {for page in [1..meta.page_count]
                        <option key={page} value={page}>{page}</option>}
                    </select>
                    {' '}
                    of {meta.page_count}
                  </label>
                </nav>}
            </div>
            <br />
            <button className="standard-button" disabled={@state.creationInProgress} onClick={@createNewProject}>
              Create a new project{' '}
              <LoadingIndicator off={not @state.creationInProgress} />
            </button>&nbsp;
            <Link className="standard-button" to="lab-policies">Project building policies</Link>&nbsp;
            <Link className="standard-button" to="lab-how-to">How to build a project</Link>
            {if @state.creationError?
              <p className="form-help error">{@state.creationError.message}</p>}
          </div>
        else
          <LandingPage user={@props.user} parentIndex={this} />
      }</PromiseRenderer>
    else
      <LandingPage parentIndex={this} />

  handlePageChange: (e) ->
    @setState page: e.target.value, =>
      @forceUpdate()

  createNewProject: ->
    project = apiClient.type('projects').create
      display_name: "Untitled project #{new Date().toISOString()}"
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
