React = require 'react'
apiClient = require '../../api/client'
{Navigation} = require 'react-router'
Loading = require '../../components/loading-indicator'
FEATURED_PRODUCT_IDS = require '../../lib/featured-projects'

module?.exports = React.createClass
  displayName: 'ProjectLinker'
  mixins: [Navigation]

  getInitialState: ->
    projects: []
    loading: true

  componentWillMount: ->
    if @props.user
      @setProjectsFromPreferences(@props.user)
    else
      @setProjectsLaunchApproved()

  shouldComponentUpdate: (nextProps, nextState) ->
    nextState.projects isnt @state.projects

  goToProjectTalk: (projectId) ->
    for project in @state.projects
      break if project.id is projectId

    [owner, name] = project.slug.split('/')
    @transitionTo 'project-talk',
      owner: owner
      name: name

  filterNonRedirected: (projects) ->
    projects.filter (p) -> p and (not p.redirect)

  setProjectsFromPreferences: (user) ->
    user.get('project_preferences').then (preferences) =>
      projectsPromise = preferences.map (pref) =>
        apiClient.type('projects')
          .get(pref.links.project)
          .catch -> false

      Promise.all(projectsPromise)
        .then (projects) =>
          @setState {projects: @filterNonRedirected(projects), loading: false}

  setProjectsLaunchApproved: ->
    apiClient.type('projects').get(launch_approved: true)
      .then (projects) =>
        @setState {projects: @filterNonRedirected(projects), loading: false}

  onChangeSelect: ->
    projectsSelect = React.findDOMNode @.refs.projectsSelect
    @goToProjectTalk projectsSelect.value

  projectOption: (project, i) ->
    <option key={project.id} value={project.id}>
      {project.display_name}
    </option>
    
  render: ->
    if @state.loading
      <Loading />

    else if @state.projects.length
      <div className="project-linker">
        <select onChange={@onChangeSelect} defaultValue="defaultValue" ref="projectsSelect">
          <option key={Math.random()}  value="defaultValue" disabled>Jump to a project</option>
          {@state.projects.map(@projectOption)}
        </select>
      </div>

    else
      <p>Error retreiving projects list.</p>
