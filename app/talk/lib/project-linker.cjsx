React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
{Link} = require 'react-router'
Loading = require '../../components/loading-indicator'
FEATURED_PRODUCT_IDS = require '../../lib/featured-projects'

take = (n, arr) -> arr.slice(0, n)

filterNonRedirected = (projects) ->
  projects.filter (p) -> p and (not p.redirect)

module?.exports = React.createClass
  displayName: 'ProjectLinker'

  getInitialState: ->
    projects: []
    projectsMeta: {}
    loading: true
    open: false

  componentDidMount: ->
    @loadMoreProjects().then(@setState.bind(this))

  loadMoreProjects: (page = 1, newProjects = [], load = 10) ->
    apiClient.type('projects').get({
      launch_approved: true,
      cards: true
      page: page,
      page_size: 20
    })
    .then (projects) =>
      projectsMeta = projects[0]?.getMeta()
      newProjects = newProjects.concat(filterNonRedirected(projects))

      if (newProjects.length < load) and (projectsMeta.page < projectsMeta.page_count)
        @loadMoreProjects((page + 1), newProjects)
      else
        return {projects: @state.projects.concat(take(load, newProjects)), projectsMeta}

  shouldComponentUpdate: (nextProps, nextState) ->
    (nextState.projects.length > @state.projects.length) or
    (nextState.open isnt @state.open) or
    (nextState.projectsMeta isnt @state.projectsMeta)

  projectLink: (project, i) ->
    [owner, name] = project.slug.split('/')

    <div key={project.id}>
      {if project.redirect
        <a href={project.redirect} title={project.redirect}>{project.display_name}</a>
      else
        <Link to="/projects/#{owner}/#{name}">
          {project.display_name}
        </Link>
        }
    </div>

  onClickLoadMore: (e) ->
    @loadMoreProjects(@state.projectsMeta.next_page).then(@setState.bind(this))

  render: ->
    <div>
      <button onClick={=> @setState({open: not @state.open})}>
        {if @state.open
          <span><i className="fa fa-close" /> Collapse Projects</span>
        else
          <span>Change projects</span>
          }
      </button>

      {if @state.open
        if @state.loading
          <Loading />

        <div className="project-linker">
          <div><Link to="/talk">Zooniverse Talk</Link></div>

          <div>{@state.projects?.map(@projectLink)}</div>

          {if @state.projectsMeta?.page isnt @state.projectsMeta?.page_count
            <button
              type="button"
              onClick={@onClickLoadMore}>
              Load more <i className="fa fa-arrow-down" />
            </button>
          else
            <hr />
            }
        </div>
        }
    </div>
