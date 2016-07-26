React = require 'react'
ReactDOM = require 'react-dom'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
ZooniverseLogo = require '../../partials/zooniverse-logo'
FEATURED_PROJECTS = require '../../lib/featured-projects'
loadImage = require '../../lib/load-image'

hovered = false

module.exports = React.createClass
  displayName: 'HomePagePromoted'

  getInitialState: ->
    projects: []
    index: 0
    timer: null

  componentDidMount: ->
    @loadProjects().then (projects) =>
      timer = setInterval @advanceIndex, 5000
      project = projects[0]
      @setState {projects, project, timer}

  componentWillUnmount: ->
    clearInterval(@state.timer) if @state.timer
    @setState timer: null

  loadProjects: ->
    apiClient.type('projects').get(id: Object.keys(FEATURED_PROJECTS), cards: true).then (projects) =>
      Promise.all(projects.map (project) =>
        featuredProject = FEATURED_PROJECTS[project.id]
        project.image = featuredProject.image
        project.caption = featuredProject.caption
        loadImage project.image
        project
      )

  hovered: ->
    hovered = true

  unhovered: ->
    hovered = false

  advanceIndex: ->
    unless hovered
      index = (@state.index + 1) % @state.projects.length
      project = @state.projects[index]
      lastProject = @state.project
      @setState {index, project, lastProject}

  setIndex: (i) ->
    =>
      index = if i >= 0 and i < @state.projects.length
        i
      else if i < 0
        @state.projects.length - 1
      else
        0

      lastProject = @state.project
      project = @state.projects[index]
      clearInterval @state.timer
      timer = setInterval @advanceIndex, 5000
      @setState {index, project, lastProject, timer}

  render: ->
    {project, lastProject} = @state
    return <div /> unless project

    # This seems silly, but it ensures the render has completed before beginning the animation
    requestAnimationFrame =>
      @refs.container.classList.add 'appearing'

      requestAnimationFrame =>
        @refs.container.classList.remove 'appearing'

    <section ref="container" className="home-promoted" onMouseEnter={@hovered} onMouseLeave={@unhovered}>
      <div className="layer"></div>
      <img className="last-background-image" src={lastProject?.image} />
      <img className="current-background-image" src={project.image} />
      <h1>THE ZO<ZooniverseLogo />NIVERSE</h1>

      <p className="description">{project.caption}</p>

      <i className="controls angles fa fa-angle-left" onClick={@setIndex(@state.index - 1)} />
      <i className="controls angles fa fa-angle-right" onClick={@setIndex(@state.index + 1)} />

      <Link to={"/projects/#{project.slug}"} className="standard-button">Join Our Team</Link>

      <div className="controls circles">
      {for promotedProject, i in @state.projects
        if promotedProject.id is project.id
          <i key={"promoted-project-#{promotedProject.id}"} className="fa fa-circle" />
        else
          <i key={"promoted-project-#{promotedProject.id}"} className="fa fa-circle-o" onClick={@setIndex(i)} />}
      </div>

      <p className="owner">Image from <strong>{project.display_name}</strong></p>
    </section>
