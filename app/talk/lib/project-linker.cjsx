React = require 'react'
apiClient = require '../../api/client'
{Navigation} = require 'react-router'
Loading = require '../../components/loading-indicator'

module?.exports = React.createClass
  displayName: 'ProjectLinker'
  mixins: [Navigation]

  getInitialState: ->
    projects: []
    loading: true

  componentWillMount: ->
    @setProjects()

  shouldComponentUpdate: (nextProps, nextState) ->
    nextState.projects isnt @state.projects

  goToProjectTalk: (projectId) ->
    for project in @state.projects
      break if project.id is projectId

    apiClient.type('users').get(project.links.owner.id)
      .then (user) =>
        @transitionTo 'project-talk', 
          owner: user.login
          name: project.slug

  setProjects: (metadata) ->
    query =
      launch_approved: true
      include: 'owners'

    apiClient.type('projects').get(query)
      .then (projects) =>
        @setState {projects, loading: false}

  onChangeSelect: ->
    projectsSelect = React.findDOMNode @.refs.projectsSelect
    @goToProjectTalk projectsSelect.value

  projectOption: (d, i) ->
    <option key={d.id} value={d.id}>
      {d.display_name}
    </option>
    
  render: ->
    if @state.loading
      <Loading />

    else if @state.projects.length
      <div className="project-linker">
        <select onChange={@onChangeSelect} ref="projectsSelect">
          {@state.projects.map(@projectOption)}
        </select>
      </div>

    else
      <p>Error retreiving projects list.</p>
