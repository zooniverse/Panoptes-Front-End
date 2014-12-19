React = require 'react'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
ProjectCard = require '../partials/project-card'

Pager = React.createClass
  displayName: 'Pager'

  getDefaultProps: ->
    type: ''
    query: {}
    renderItems: null

  getInitialState: ->
    request: @makeRequest 1
    page: NaN
    pageCount: NaN

  makeRequest: (page) ->
    params = Object.assign {page}, @props?.query
    apiClient.createType(@props.type).get params, Infinity, @handleResponse

  handleResponse: (request) ->
    # NOTE: Handling request metadata is currently pretty gnarly.
    {meta} = JSON.parse request.responseText
    @setState
      page: meta[@props.type].page
      pageCount: meta[@props.type].page_count

  goToPage: (page) ->
    @setState
      request: @makeRequest page

  render: ->
    <div className="pager">
      <PromiseRenderer promise={@state.request} then={@props.renderItems}>
        <div>Loading <code>{@props.type}</code>...</div>
      </PromiseRenderer>

      <nav className="pager-navigation">
        {for page in [1..@state.pageCount]
          current = page is @state.page
          <button key={page} disabled={current} onClick={@goToPage.bind this, page}>{page}</button>}
      </nav>
    </div>

module.exports = React.createClass
  displayName: 'ProjectsPage'

  render: ->
    <div className="projects-page">
      <div className="content-container">
        <h1>Projects</h1>
      </div>
      <hr />
      <div className="content-container">
        <Pager type="projects" renderItems={@renderProjects} />
      </div>
    </div>

  renderProjects: (projects) ->
    <div className="project-card-list">
      {for project in projects
        <ProjectCard key={project.id} project={project} />}
    </div>
