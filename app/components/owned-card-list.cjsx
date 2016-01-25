counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
Translate = require 'react-translate-component'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
OwnedCard = require '../partials/owned-card'
{Link, State, Navigation} = require 'react-router'
DisciplineSlider = require './discipline-slider'
{PROJECT_SORTS} = require '../components/project-sorts'
Select = require 'react-select'
debounce = require 'debounce'

module.exports = React.createClass
  displayName: 'OwnedCardList'
  mixins: [State, Navigation]

  ignoreUpdate: false

  propTypes:
    imagePromise: React.PropTypes.func.isRequired
    listPromise: React.PropTypes.func.isRequired
    cardLink: React.PropTypes.func.isRequired
    translationObjectName: React.PropTypes.string.isRequired
    ownerName: React.PropTypes.string
    heroClass: React.PropTypes.string
    heroNav: React.PropTypes.node
    skipOwner: React.PropTypes.bool

  getRoutes: ->
    this.props.routes

  getInitialState: ->
    listPromise: null
    tagFilter: ''
    currentPage: null
    sort: ''
    page: 1

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  componentWillMount: ->
    @readQuery
    @setState currentPage: @currentPage()
    @setState listPromise: @props.listPromise(@buildQuery())

  componentWillUpdate: (nextProps, nextState)->
    @ignoreUpdate = true
    for own key of nextState
      continue if key == 'listPromise'
      @ignoreUpdate = @ignoreUpdate && @state[key] == nextState[key]

  componentDidUpdate: ->
    @setState listPromise: @props.listPromise(@buildQuery()) unless @ignoreUpdate
    @ignoreUpdate = false

  readQuery: () ->
    {sort, page, discipline} = @context.router.getCurrentQuery()
    @setState sort: sort || ''
    @setState page: page || 1
    @setState tags: discipline || ''

  buildQuery: (query) ->
    newQuery = Object.assign {}, query

    newQuery.sort = @state.sort if @state.sort
    newQuery.tags = @state.tagFilter if @state.tagFilter
    newQuery.page = @state.page if @state.page != 1

    console.log newQuery
    return newQuery

  computeQueryString: (query) ->
    accum = []
    query = @buildQuery query
    for own key of query
      accum.push([key, '=', query[key]].join(''))
    return accum.join('&')

  setPage: (page) ->
    @setState page: page, #->
      #window.location.search = @computeQueryString null

  setSort: (newSort) ->
    @setState sort: newSort, #->
      #window.location.search = @computeQueryString null

  filterDiscipline: (discipline) ->
    @setState tagFilter: discipline, #->
      #window.location.search = @computeQueryString null

  searchProjectName: (value, callback) ->
    return callback null, { options: [] } if value is ''

    apiClient.type('projects').get(search: "#{value}", page_size: 10)
      .then (projects) =>
        opts = projects.map (project) ->
          {
            value: project.id,
            label: project.display_name,
            project: project
          }

        callback null, {
          options: opts
        }

  currentPage: ->
    routes = @getRoutes()
    routes[routes.length - 1].path

  routeToProject: (projectID) ->
    apiClient.type('projects').get(projectID)
      .then (project) =>
        if project.redirect?
          window.location.href = project.redirect
        else
          [owner, name] = project.slug.split('/')
          @transitionTo 'project-home', owner: owner, name: name

  userForTitle: ->
    if @props.ownerName
      "#{@props.ownerName}'s"
    else
      'All'

  render: ->
    {location} = @props

    <div className="secondary-page all-resources-page">
      <section className={"hero #{@props.heroClass}"}>
        <div className="hero-container">
          <Translate component="h1" user={@userForTitle()} content={"#{@props.translationObjectName}.title"} />
          {if @props.heroNav?
            @props.heroNav}
        </div>
      </section>
      <section className="resources-container">
        <DisciplineSlider filterDiscipline={@filterDiscipline} />
        <PromiseRenderer promise={@state.listPromise}>{(ownedResources) =>
          if ownedResources?.length > 0
            meta = ownedResources[0].getMeta()
            <div>
              <div className="resource-results-counter card-list" style={{overflow: 'visible'}}> {if meta
                  pageStart = meta.page * meta.page_size - meta.page_size + 1
                  pageEnd = Math.min(meta.page * meta.page_size, meta.count)
                  count = meta.count
                  <Translate pageStart={pageStart} pageEnd={pageEnd} count={count} content="#{@props.translationObjectName}.countMessage" component="p" />
                  <p className="showing-with-link-para"><Translate pageStart={pageStart} pageEnd={pageEnd} count={count} content="#{@props.translationObjectName}.countMessage" /><Link to='disciplines' className="view-by-discipline-link">View by discipline</Link></p>}
                {if @state.currentPage is 'projects'
                  <Select
                    multi={false}
                    name="resourcesid"
                    placeholder="Project Name:"
                    searchPromptText="Search by a project name"
                    closeAfterClick={true}
                    asyncOptions={debounce(@searchProjectName, 200)}
                    onChange={@routeToProject}
                    className="search project-search standard-input"
                  />}
                {if @state.currentPage is 'projects'
                   <Select
                    multi={false}
                    name="sort_order"
                    placeholder="Sort By:"
                    searchPromptText="Select a sort order"
                    closeAfterClick={true}
                    className='standard-input search project-sort'
                    value={@state.sort}
                    options={PROJECT_SORTS}
                    onChange={@setSort} />
                }
              </div>
              <div className="card-list">
                {for resource in ownedResources
                   <OwnedCard
                     key={resource.id}
                     resource={resource}
                     imagePromise={@props.imagePromise(resource)}
                     linkTo={@props.cardLink(resource)}
                     translationObjectName={@props.translationObjectName}
                     skipOwner={@props.skipOwner} />}
              </div>
              <nav>
                {if meta
                  <nav className="pagination">
                    {for page in [1..meta.page_count]
                      active = (page is +location.query.page) or (page is 1 and not location.search)
                      <Link to={@props.linkTo} query={@buildQuery page: page} key={page} className="pill-button" style={border: "2px solid" if page is 1 and window.location.search is ""}>{page}</Link>}
                  </nav>}
              </nav>
            </div>
          else if ownedResources?.length is 0
            <Translate content="#{@props.translationObjectName}.notFoundMessage" component="div" />
          else
            <Translate content="#{@props.translationObjectName}.loadMessage" component="div" />
        }</PromiseRenderer>
      </section>
    </div>
