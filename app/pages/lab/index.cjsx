React = require 'react'
createReactClass = require 'create-react-class'
{browserHistory, Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
ModalFormDialog = require 'modal-form/dialog'
{ Helmet } = require 'react-helmet'
counterpart = require 'counterpart'
projectActions = require './actions/project'
LandingPage = require './landing-page'
`import LabStatus from '../../partials/lab-status.jsx';`

counterpart.registerTranslations 'en',
  buildAProject:
    title: 'Build a Project'

ProjectLink = createReactClass
  getDefaultProps: ->
    project: {}
    avatar: null
    owner: null

  render: ->
    <div className="lab-index-project-row">
      <Link to="/lab/#{@props.project.id}" className="lab-index-project-row__link lab-index-project-row__group lab-index-project-row__action">
        {if @props.avatar?
          <img className="lab-index-project-row__avatar" src={@props.avatar.src} />}
        <div className="lab-index-project-row__description">
          <strong className="lab-index-project-row__name">{@props.project.display_name}</strong>{' '}
          {if @props.owner?
            <small>by {@props.owner.display_name}</small>}
        </div>
        <span className="lab-index-project-row__icon-button">
          <i className="fa fa-pencil fa-fw"></i>{' '}
          <small>Edit</small>
        </span>
      </Link>
      <Link to="/projects/#{@props.project.slug}" className="lab-index-project-row__link lab-index-project-row__icon-button lab-index-project-row__action">
        <i className="fa fa-hand-o-right fa-fw"></i>{' '}
        <small>View</small>
      </Link>
    </div>

ProjectList = createReactClass
  getDefaultProps: ->
    title: ''
    page: 1
    roles: []
    withAvatars: false
    withOwners: false
    onChangePage: ->

  getInitialState: ->
    loading: false
    pages: 0
    projects: []
    avatars: {}
    owners: {}
    error: null

  componentDidMount: ->
    @loadData @props.roles, @props.page, @props.withAvatars, @props.withOwners

  componentWillReceiveProps: (nextProps) ->
    # TODO: This is hacky. Find a nice deep comparison.
    anyChanged = Object.keys(nextProps).some (key) =>
      JSON.stringify(nextProps[key]) isnt JSON.stringify(@props[key])
    if anyChanged
      @loadData nextProps.roles, nextProps.page, nextProps.withAvatars, nextProps.withOwners

  loadData: (roles, page, withAvatars, withOwners) ->
    @setState
      avatars: {}
      owners: {}
      error: null
      loading: true

    include = []
    if @props.withAvatars
      include.push 'avatar'
    if @props.withOwners
      include.push 'owners'

    query =
      current_user_roles: roles
      page: page
      include: include
      sort: 'display_name'

    awaitProjects = apiClient.type('projects').get query
      .then (projects) =>
        @setState {projects}
      .catch (error) =>
        @setState {error}
      .then =>
        @setState loading: false
      .then =>
        @state.projects.forEach (project) =>
          if @props.withAvatars
            project.get 'avatar'
              .catch =>
                {}
              .then (avatar) =>
                @state.avatars[project.id] = avatar
                @forceUpdate()
          if @props.withOwners
            project.get 'owner'
              .catch =>
                null
              .then (owner) =>
                @state.owners[project.id] = owner
                @forceUpdate()

  handlePageChange: (e) ->
    @props.onChangePage parseFloat e.target.value

  render: ->
    pages = Math.max @state.projects[0]?.getMeta()?.page_count ? 1, @props.page

    <div className="content-container">
      <header>
        <p>
          <strong className="form-label">{@props.title}</strong>{' '}
          {unless @state.error? or pages is 1
            <small className="form-help">
              Page{' '}
              <select value={@props.page} disabled={@state.loading} onChange={@handlePageChange}>
                {[1..pages].map (page) =>
                  <option key={page} value={page}>{page}</option>}
              </select>
            </small>}
        </p>
      </header>

      {if @state.loading
        <small className="form-help">Loading...</small>
      else if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>
      else if @state.projects.length is 0
        <p className="form-help">No projects</p>
      else
        <ul className="lab-index-project-list">
          {@state.projects.map (project) =>
            <li key={project.id} className="lab-index-project-list__item">
              <ProjectLink
                project={project}
                avatar={@state.avatars[project.id]}
                owner={@state.owners[project.id]}
              />
            </li>}
        </ul>}
    </div>

ProjectCreationForm = createReactClass
  getDefaultProps: ->
    onCancel: ->
    onSubmit: ->
    onSuccess: ->

  getInitialState: ->
    busy: false
    error: null

  handleSubmit: (e) ->
    e.preventDefault()

    @setState
      busy: true
      error: null

    awaitSubmission = @props.onSubmit
      display_name: @refs.displayNameInput.value
      description: @refs.descriptionInput.value
      introduction: @refs.introductionInput.value

    Promise.resolve(awaitSubmission)
      .then (result) =>
        @props.onSuccess result
      .catch (error) =>
        @setState {error}
      .then =>
        @setState busy: false

  render: ->
    <form onSubmit={@handleSubmit} style={maxWidth: '90vw', width: '60ch'}>
      <p>
        <label>
          <span className="form-label">Project name</span><br />
          <input type="text" ref="displayNameInput" className="standard-input full" defaultValue="Untitled project (#{new Date().toLocaleString()})" required disabled={@state.busy} />
        </label>
      </p>
      <p>
        <label>
          <span className="form-label">Short description</span><br />
          <input type="text" ref="descriptionInput" className="standard-input full" defaultValue="A short description of the project" required disabled={@state.busy} />
        </label>
      </p>
      <p>
        <label>
          <span className="form-label">Introduction</span><br />
          <textarea type="text" ref="introductionInput" className="standard-input full" defaultValue="A more in-depth introduction to your science..." rows="5" required disabled={@state.busy} />
        </label>
      </p>
      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>}
      <p style={textAlign: 'center'}>
        <button type="button" className="minor-button" disabled={@state.busy} onClick={@props.onCancel}>Cancel</button>{' '}
        <button type="submit" className="major-button" disabled={@state.busy}>Create project</button>
      </p>
    </form>

module.exports = createReactClass
  getDefaultProps: ->
    user: null
    loaction:
      query:
        'owned-page': 1
        'collaborations-page': 1
    actions: projectActions

  getInitialState: ->
    creationInProgress: false

  handlePageChange: (which, page) ->
    queryUpdate = {}
    queryUpdate[which] = page
    newQuery = Object.assign {}, @props.location.query, queryUpdate
    newLocation = Object.assign {}, @props.location, query: newQuery
    browserHistory.push newLocation

  showProjectCreator: ->
    @setState creationInProgress: true

  hideProjectCreator: ->
    @setState creationInProgress: false

  handleProjectCreation: (project) ->
    @hideProjectCreator()
    newLocation = Object.assign {}, @props.location, pathname: "/lab/#{project.id}"
    browserHistory.push newLocation

  render: ->
    if @props.user?
      <div>
        <Helmet title={counterpart "buildAProject.title"} />
        <LabStatus />
        <ProjectList
          title="Your projects"
          page={@props.location.query['owned-page']}
          roles={['owner']}
          withAvatars
          onChangePage={@handlePageChange.bind this, 'owned-page'}
        />
        <div className="content-container">
          <p style={textAlign: 'center'}>
            <button type="button" className="major-button" onClick={@showProjectCreator}>Create a new project</button>{' '}
            <a href="https://help.zooniverse.org/getting-started" className="standard-button">How-to</a>{' '}
            <a href="https://help.zooniverse.org/getting-started/glossary" className="standard-button">Glossary</a>{' '}
            <a href="https://help.zooniverse.org/getting-started/lab-policies" className="standard-button">Policies</a>{' '}
            <a href="https://help.zooniverse.org/best-practices" className="standard-button">Best Practices</a>{' '}
            <a href="/talk/18" className="standard-button">Project Builder Talk</a>{' '}
          </p>
        </div>
        {if @state.creationInProgress
          <ModalFormDialog tag="div">
            <ProjectCreationForm onSubmit={@props.actions.createProject} onCancel={@hideProjectCreator} onSuccess={@handleProjectCreation} />
          </ModalFormDialog>}
        <hr />
        <ProjectList
          title="Collaborations"
          page={@props.location.query['collabarations-page']}
          roles={['collaborator']}
          withOwners
          style={fontSize: '0.8em'}
          onChangePage={@handlePageChange.bind this, 'collabarations-page'}
        />
      </div>

    else
      <LandingPage />
