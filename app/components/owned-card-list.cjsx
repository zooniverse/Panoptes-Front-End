counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
Translate = require 'react-translate-component'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
ChangeListener = require '../components/change-listener'
OwnedCard = require '../partials/owned-card'
Select = require 'react-select'
{DISCIPLINES} = require '../components/disciplines'
{PROJECT_SORTS} = require '../components/project-sorts'
{Link, State, Navigation} = require '@edpaget/react-router'
debounce = require 'debounce'

module.exports = React.createClass
  displayName: 'OwnedCardList'
  mixins: [State, Navigation]

  propTypes:
    imagePromise: React.PropTypes.func.isRequired
    listPromise: React.PropTypes.object.isRequired
    cardLink: React.PropTypes.func.isRequired
    translationObjectName: React.PropTypes.string.isRequired
    ownerName: React.PropTypes.string
    heroClass: React.PropTypes.string
    heroNav: React.PropTypes.node

  getInitialState: ->
    listPromise: @props.listPromise
    tagFilter: ''
    currentPage: null
    sortOrder: ''

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'
    @setState currentPage: @currentPage()

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  userForTitle: ->
    if @props.ownerName
      "#{@props.ownerName}'s"
    else
      'All'

  buildQuery: (query) ->
    query = query || {}
    query.sort = encodeURIComponent(@state.sortOrder) if @state.sortOrder
    query.tags = @state.tagFilter if @state.tagFilter
#    query.launch_approved = true if !apiClient.params.admin
    return query

  setSort: (newSort) ->
    @setState sortOrder: newSort, ->
      @setState listPromise: apiClient.type('projects').get @buildQuery (include: 'avatar')

  filterDiscipline: (discipline) ->
    @setState tagFilter: discipline, ->
      @setState listPromise: apiClient.type('projects').get @buildQuery (include: 'avatar')

  searchProjectName: (value, callback) ->
    unless value is ''
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
    routes[routes.length - 1].name

  routeToProject: (projectID) ->
    apiClient.type('projects').get(projectID)
      .then (project) =>
        if project.redirect?
          window.location.href = project.redirect
        else
          [owner, name] = project.slug.split('/')
          @transitionTo 'project-home', owner: owner, name: name

  render: ->
    <div className="secondary-page all-resources-page">
      <section className={"hero #{@props.heroClass}"}>
        <div className="hero-container">
          <Translate component="h1" user={@userForTitle()} content={"#{@props.translationObjectName}.title"} />
          {if @props.heroNav?
            @props.heroNav}
        </div>
      </section>
      <section className="resources-container">
        <Select
          ref="disciplineSelect"
          name="disciplines"
          placeholder="Filter by discipline"
          className="discipline-filter"
          value={@state.tagFilter}
          options={DISCIPLINES}
          onChange={@filterDiscipline} />

        <PromiseRenderer promise={@state.listPromise}>{(ownedResources) =>
          if ownedResources?.length > 0
            meta = ownedResources[0].getMeta()
            <div>
              <div className="resource-results-counter">
                {if meta
                  pageStart = meta.page * meta.page_size - meta.page_size + 1
                  pageEnd = Math.min(meta.page * meta.page_size, meta.count)
                  count = meta.count
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
                />
              }

              {if @state.currentPage is 'projects'
                <Select
                  multi={false}
                  name="sort_order"
                  placeholder="Sort By:"
                  searchPromptText="Select a sort order"
                  closeAfterClick={true}
                  className='standard-input search project-sort'
                  value={@state.sortOrder}
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
                     translationObjectName={@props.translationObjectName}/>}
              </div>
              <nav>
                {if meta
                  <nav className="pagination">
                    {for page in [1..meta.page_count]
                      <Link to={@props.linkTo} query={{page}} key={page} className="pill-button" style={border: "2px solid" if page is 1 and window.location.search is ""}>{page}</Link>}
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
