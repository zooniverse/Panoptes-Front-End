React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'

ProjectLink = React.createClass
  getDefaultProps: ->
    project: {}
    avatar: null
    owner: null

  render: ->
    <div className="lab-index-project-row">
      {if @props.avatar?
        style =
          backgroundImage: "url(#{@props.avatar.src})"
        <div className="lab-index-project-row-avatar" style={style} />}
      <div className="lab-index-project-row-description">
        <strong className="lab-index-project-row-name">{@props.project.display_name}</strong>{' '}
        {if @props.owner?
          <small>by {@props.owner.display_name}</small>}
      </div>
      <Link to="/lab/#{@props.project.id}" className="lab-index-project-row-icon-button" title="Edit">
        <i className="fa fa-pencil fa-fw"></i>
      </Link>
      <Link to="/projects/#{@props.project.slug}" className="lab-index-project-row-icon-button" title="View">
        <i className="fa fa-hand-o-right fa-fw"></i>
      </Link>
    </div>

ProjectList = React.createClass
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
        <strong className="form-label">{@props.title}</strong>{' '}
        {unless @state.error? or pages is 1
          <small className="form-help">
            Page{' '}
            <select value={@props.page} disabled={@state.loading} onChange={@handlePageChange}>
              {[1..pages].map (page) =>
                <option key={page} value={page}>{page}</option>}
            </select>
          </small>}
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
            <li key={project.id}>
              <ProjectLink
                project={project}
                avatar={@state.avatars[project.id]}
                owner={@state.owners[project.id]}
              />
            </li>}
        </ul>}
    </div>

module.exports = React.createClass
  getDefaultProps: ->
    user: null
    loaction:
      query:
        'owned-page': 1
        'collaborations-page': 1

  handlePageChange: (which, page) ->
    queryUpdate = {}
    queryUpdate[which] = page
    newQuery = Object.assign {}, @props.location.query, queryUpdate
    newLocation = Object.assign {}, @props.location, query: newQuery
    @props.history.replace newLocation

  render: ->
    console.info 'Q', @props.query
    if @props.user?
      <div>
        <ProjectList
          title="Your projects"
          page={@props.location.query['owned-page']}
          roles={['owner', 'workaround']}
          withAvatars
          onChangePage={@handlePageChange.bind this, 'owned-page'}
        />

        <p style={textAlign: 'center'}>
          <button type="button" className="standard-button" disabled>Create a new project</button>
        </p>

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
      <p className="form-help">TODO: Not-signed-in landing page</p>
