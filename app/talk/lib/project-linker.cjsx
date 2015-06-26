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
    @setProjects()

  shouldComponentUpdate: (nextProps, nextState) ->
    nextState.projects isnt @state.projects

  goToProjectTalk: (projectId) ->
    for project in @state.projects
      break if project.id is projectId

    project.get('owner').then (owner) =>
      @transitionTo 'project-talk', 
        owner: owner.login
        name: project.slug

  setProjects: (metadata) ->
    # query =
    #   launch_approved: true
    #   include: 'owners'

    # For launch, since I can't filter by if a project has a redirect or not.
    query = FEATURED_PRODUCT_IDS

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
