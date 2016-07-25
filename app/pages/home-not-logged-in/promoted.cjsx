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
      for project in projects when project.image
        image = new Image()
        image.src = project.image

      timer = setInterval =>
        unless hovered
          @setState index: (@state.index + 1) % @state.projects.length
          @refs.container.classList.add 'appearing'
      , 5000

      @setState {projects, timer}

  componentWillUnmount: ->
    clearInterval(@state.timer) if @state.timer
    @setState timer: null

  loadProjects: ->
    apiClient.type('projects').get(id: Object.keys(FEATURED_PROJECTS), cards: true, include: 'background,avatar').then (projects) =>
      Promise.all(projects.map (project) =>
        project.get 'background'
          .then ([background]) =>
            project.image = background.src
            project.caption = FEATURED_PROJECTS[project.id]
            loadImage project.image or './assets/default-project-background.jpg'
            project
          .catch =>
            project.image = project.avatar_src
            project.caption = "needs your help"
            project
      )

  hovered: ->
    hovered = true

  unhovered: ->
    hovered = false

  setIndex: (i) ->
    =>
      if i >= 0 and i < @state.projects.length
        @setState index: i
      else if i < 0
        @setState index: @state.projects.length - 1
      else
        @setState index: 0

  render: ->
    project = @state.projects[@state.index]
    return <div /> unless project
    lastIndex = (@state.projects.length + @state.index - 1) % @state.projects.length
    lastProject = @state.projects[lastIndex]

    @refs?.container?.classList?.add 'appearing'
    background = project.image or './assets/default-project-background.jpg'
    lastBackground = lastProject.image or './assets/default-project-background.jpg'

    # This seems silly, but it ensures the render has completed before beginning the animation
    requestAnimationFrame =>
      requestAnimationFrame =>
        @refs.container.classList.remove 'appearing'

    <section ref="container" className="home-promoted" onMouseEnter={@hovered} onMouseLeave={@unhovered}>
      <div className="layer"></div>
      <img className="last-background-image" src={lastBackground} />
      <img className="current-background-image" src={background} />
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

      <p className="owner">Image from <b>{project.display_name} Project</b></p>
    </section>
