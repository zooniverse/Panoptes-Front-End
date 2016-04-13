React = require('react')
PromiseRenderer = require '../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
Select = require 'react-select'
{Link, Router, Navigation, History} = require 'react-router'
Translate = require 'react-translate-component'
debounce = require 'debounce'
Filmstrip = require '../components/filmstrip'
PROJECT_SORTS = (require './project-sorts').PROJECT_SORTS

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
    project: React.PropTypes.object.isRequired

  getDefaultProps: ->
    avatar: ''
    name: ''
    slug: ''

  componentDidMount: ->
    card = @refs.ownedCard

    Promise.resolve (if @props.project.avatar_src then "//#{ @props.project.avatar_src }" else './assets/simple-avatar.jpg')
      .then (src) =>
        card.style.backgroundImage = "url('#{src}')"
        card.style.backgroundSize = "contain"
      .catch =>
        card.style.background = "url('./assets/simple-pattern.jpg') center center repeat"

    card.classList.add 'project-card'

  render: ->
    project = @props.project
    avatarSrcWithProtocol = if !!project.avatar_src
      'https://' + project.avatar_src

    # [owner, name] = project.slug.split('/')
    linkProps =
      to: if project.redirect then project.redirect else '/projects/' + project.slug

    <FlexibleLink {...linkProps}>
      <div className="card" ref="ownedCard">
        <svg className="card-space-maker" viewBox="0 0 2 1" width="100%"></svg>
        <div className="details">
          <div className="name"><span>{project.display_name}</span></div>
          {<div className="description">{project.description}</div> if project.description?}
          <button type="button" tabIndex="-1" className="standard-button card-button"><Translate content={"projectsPage.button"} /></button>
        </div>
      </div>
    </FlexibleLink>

ProjectCardList = React.createClass
  displayName: 'ProjectCardList'

  getDefaultProps: ->
    projects: []

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="card-list">
      {@props.projects.map (project) =>
        <div key={project.id}>
          <ProjectCard project={project} />
        </div>}
    </div>


DisciplineSelector = React.createClass
  displayName: 'DisciplineSelector'

  render: ->
    <Filmstrip increment={350} value={@props.value} onChange={@props.onChange}/>

SearchSelector = React.createClass

  displayName: 'SearchSelector'
  mixins: [History]

  getDefaultProps: ->
    onChange: ->
    query: ->
    navigate: ->

  navigateToProject: (projectID) ->
    apiClient.type('projects').get(projectID)
      .then (project) ->
        if project.redirect?
          window.location.href = project.redirect
        else
          window.location.href = ['/projects', project.slug].join('/')

  searchByName: (value, callback) ->

    if value?.trim().length > 0
      apiClient.type('projects').get(search: "#{value}", page_size: 10)
        .then (projects) ->
          opts = projects.map (project) ->
            {
              value: project.id,
              label: project.display_name,
              project: project
            }

          callback null, { options: (opts || []) }

    callback null, {options: []}

  handleChange: (e) ->
    @props.onChange e.value

  render: ->
    <Select
      multi={false}
      name="resourcesid"
      placeholder="Name:"
      value=""
      searchPromptText="Search by name"
      closeAfterClick={true}
      asyncOptions={debounce(@searchByName, 500)}
      onChange={@navigateToProject}
      className="search card-search standard-input"
    />

SortSelector = React.createClass
  displayName: 'SortSelector'
  getDefaultProps: ->
    value: 'default'
    sortMethods: PROJECT_SORTS
    onChange: ->

  handleChange: (e) ->
    @props.onChange e.target.value

  render: ->
    <Select
     multi={false}
     name="sort_order"
     value={@props.value}
     placeholder="Sort by"
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
      {if @props.total>1
         for page in [1..@props.total]
           active = (page is +@props.current)
           <button onClick={@handleChange.bind this, page} key={page} className="pill-button" style={border: "2px solid" if active}>{page}</button>}
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
    project_count: 0
    loading: false
    error: null
    query: {}

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
      sort: sort ? @constructor.defaultProps.sort
      launch_approved: true unless apiClient.params.admin
      cards: true
      include: ['avatar']

    unless !!query.tags
      delete query.tags

    apiClient.type('projects').get(query)
      .then (projects) =>
        pages = projects[0]?.getMeta()?.page_count
        project_count = projects[0]?.getMeta()?.count
        project_count ?= 0
        @setState {projects, pages, project_count}
      .catch (error) =>
        @setState {error}
      .then =>
        @setState loading: false

  handleDisciplineChange: (discipline) ->
    this.props.onChangeQuery {discipline}

  handleSortChange: (sort) ->
    page = 1
    this.props.onChangeQuery {sort, page}

  handlePageChange: (page) ->
    this.props.onChangeQuery {page}

  setFilter: (e) ->

  render: ->
    <div className="secondary-page all-resources-page">

      <section className="hero projects-hero">
        <div className="hero-container">
          <Translate component="h1" content={"projectsPage.title"} />
        </div>
      </section>

      <section className="resources-container">
        <DisciplineSelector value={@props.discipline} onChange={@handleDisciplineChange} />
        <div className="resource-results-counter">
          <SearchSelector />
          <SortSelector value={@props.sort} onChange={@handleSortChange} />
        </div>

        {if @state.project_count>0
           pageStart = @props.page * 20 - 20 + 1
           pageEnd = Math.min(@props.page * 20, @state.project_count)
           showingMessage = "projectsPage.countMessage"
         else
           showingMessage = "projectsPage.notFoundMessage"
        <p className="showing-with-link-para"><Translate pageStart={pageStart} pageEnd={pageEnd} count={@state.project_count} content={showingMessage} /></p>}
        <PageSelector current={@props.page} total={@state.pages} onChange={@handlePageChange} />
        
        <ProjectCardList projects={@state.projects} />

        <PageSelector current={@props.page} total={@state.pages} onChange={@handlePageChange} />
        
      </section>

    </div>

module.exports =
  ProjectCard: ProjectCard
  ProjectCardList: ProjectCardList
  ProjectFilteringInterface: ProjectFilteringInterface
