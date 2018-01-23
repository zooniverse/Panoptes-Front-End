React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
{Link} = require 'react-router'
Loading = require('../../components/loading-indicator').default

module.exports = createReactClass
  displayName: 'ProjectLinker'

  contextTypes:
    geordi: PropTypes.object

  getInitialState: ->
    projects: []
    meta: {}
    loading: true

  componentWillReceiveProps: (nextProps, nextContext)->
    @logClick = nextContext?.geordi?.makeHandler? 'change-project-sidebar'

  componentDidMount: ->
    @loadMoreProjects()

  loadMoreProjects: (page = 1) ->
    talkClient.type('projects').get(page: page).then (projects) =>
      meta = projects[0]?.getMeta() or {}
      projects = @state.projects.concat projects
      @setState {projects, meta, loading: false}

  projectLink: (project, i) ->
    [owner, name] = project.slug.split('/')

    <div key={project.id}>
      <Link to="/projects/#{owner}/#{name}/talk" onClick={@logClick?.bind(this, project.display_name)}>
        {project.display_name}
      </Link>
    </div>

  onClickLoadMore: (e) ->
    @loadMoreProjects @state.meta.next_page

  render: ->
    <div>
      {if @state.loading
        <Loading />
      else
        <div className="project-linker">
          <div><Link to="/talk">Zooniverse Talk</Link></div>

          <div>{@state.projects?.map(@projectLink)}</div>

          {if @state.meta?.next_page
            <button
              type="button"
              onClick={@onClickLoadMore}>
              Load more <i className="fa fa-arrow-down" />
            </button>}
        </div>}
    </div>
