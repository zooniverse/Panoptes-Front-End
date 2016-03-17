React = require('react')
apiClient = require 'panoptes-client/lib/api-client'
Select = require 'react-select'
{Link} = require 'react-router'

FlexibleLink = React.createClass
  displayName: 'FlexibleLink'

  propTypes:
    to: React.PropTypes.string.isRequired
    skipOwner: React.PropTypes.bool

  isExternal: ->
    @props.to.indexOf('http') > -1

  render: ->
    if @isExternal()
      <a href={@props.to}>{@props.children}</a>
    else
      <Link {...@props}>{@props.children}</Link>

ProjectCard = React.createClass
  displayName: 'ProjectCard'
  propTypes:
    avatar: React.PropTypes.string
    name: React.PropTypes.string.isRequired
    slug: React.PropTypes.string.isRequired
    redirect: React.PropTypes.string

  getDefaultProps: ->
    avatar: ''
    name: ''
    slug: ''

  render: ->
    avatarSrcWithProtocol = if !!@props.avatar
      'https://' + @props.avatar

    [owner, name] = @props.slug.split('/')
    linkProps =
      to: if @props.redirect then @props.redirect else '/projects/' + @props.slug
      params:
        owner: owner
        name: name

    <FlexibleLink {...linkProps}>
      <img src={avatarSrcWithProtocol} style={height: '1em', width: '1em'} />{' '}
      <strong>{@props.name}</strong>
    </FlexibleLink>

ProjectCardList = React.createClass
  displayName: 'ProjectCardList'

  getDefaultProps: ->
    projects: []

  render: ->
    <ul>
      {@props.projects.map (project) =>
        <li key={project.id}>
          <ProjectCard avatar={project.avatar_src} name={project.display_name} slug={project.slug} redirect={project.redirect} />
        </li>}
    </ul>


DisciplineSelector = React.createClass
  displayName: 'your filmstrip here'

  render: ->
    <span>filmstrip</span>

SortSelector = React.createClass
  displayName: 'SortSelector'
  getDefaultProps: ->
    value: 'active'
    sortMethods: [
      { key: 'active', label: 'Active' }
      { key: 'inactive', label: 'Inactive' }
    ]
    onChange: ->

  handleChange: (e) ->
    @props.onChange e.target.value

  render: ->
    <Select
     multi={false}
     name="sort_order"
     placeholder="Sort By"
     searchPromptText="Select a sort order"
     closeAfterClick={true}
     className="standard-input search card-sort"
     options={@props.sortMethods}
     onChange={@props.onChange} />

PageSelector = React.createClass
  displayName: 'PageSelector'
  getDefaultProps: ->
    current: 1
    total: 0

  handleChange: (page) ->
    @props.onChange page

  render: ->
    <nav className="pagination">
      {for page in [1..@props.total]
        active = (page is +@props.current)
        <a onClick={@handleChange.bind this, page} key={page} className="pill-button" style={border: "2px solid" if active}>{page}</a>}
    </nav>

ProjectFilteringInterface = React.createClass
  getDefaultProps: ->
    discipline: ''
    page: 1
    sort: '-activity'

    # To separate the API from the UI (and present the user with more friendly query terms):
    SORT_QUERY_VALUES:
      'active': '-last_modified'
      'inactive': 'last_modified'

  getInitialState: ->
    projects: []
    pages: 0
    loading: false
    error: null

  componentDidMount: ->
    {discipline, page, sort} = @props
    @loadProjects {discipline, page, sort}

  componentWillReceiveProps: (nextProps) ->
    {discipline, page, sort} = nextProps
    if discipline isnt @props.discipline or page isnt @props.page or sort isnt @props.sort
      @loadProjects {discipline, page, sort}

  loadProjects: ({discipline, page, sort}) ->
    @setState
      loading: true
      error: null

    query =
      tags: discipline || undefined
      page: page
      sort: @props.SORT_QUERY_VALUES[sort] ? @constructor.defaultProps.sort
      launch_approved: true
      cards: true
      include: ['avatar']

    unless !!query.tags
      delete query.tags

    apiClient.type('projects').get(query)
      .then (projects) =>
        pages = projects[0]?.getMeta()?.page_count
        @setState {projects, pages}
      .catch (error) =>
        @setState {error}
      .then =>
        @setState loading: false

  handleDisciplineChange: (discipline) ->
    this.props.onChangeQuery {discipline}

  handleSortChange: (sort) ->
    this.props.onChangeQuery {sort}

  handlePageChange: (page) ->
    this.props.onChangeQuery {page}

  render: ->
    <div>
      <header>
        <DisciplineSelector value={@props.discipline} onChange={@handleDisciplineChange} />
        <SortSelector value={@props.sort} onChange={@handleSortChange} />
      </header>

      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>
      else
        <div>
          {if @state.loading
            <p className="form-help">Loading projects...</p>}
          <ProjectCardList projects={@state.projects} />
          <footer>
            <nav>
              Page:{' '}
              <PageSelector current={@props.page} total={@state.pages} onChange={@handlePageChange} />{' '}
              of {@state.pages}
            </nav>
          </footer>
        </div>}
    </div>

module.exports =
  ProjectCard: ProjectCard
  ProjectCardList: ProjectCardList
  ProjectFilteringInterface: ProjectFilteringInterface
