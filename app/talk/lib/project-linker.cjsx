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
    apiClient.type('projects').get(projectId.toString()).then (project) =>
      project.get('owner').then (owner) =>
        @transitionTo 'project-talk', 
          owner: owner.login
          name: project.slug

  setProjects: (metadata) ->
    query =
      launch_approved: true
      include: 'owners'

    apiClient.type('projects').get(query)
      .then (projects) =>
        @setState {projects, loading: false}

  onChangeSelect: (e) ->
    projectsSelect = React.findDOMNode(@).querySelector('select')
    projectId = projectsSelect.options[projectsSelect.selectedIndex].value
    @goToProjectTalk(projectId)

  projectOption: (d, i) ->
    <option key={d.id} value={d.id}>
      {d.display_name}
    </option>
    
  render: ->
    if @state.loading
      <Loading />

    else if @state.projects.length
      <div className="project-linker">
        <select onChange={@onChangeSelect}>
          {@state.projects.map(@projectOption)}
        </select>
      </div>

    else
      <p>Error retreiving projects list.</p>
