React = require 'react'
ReactDOM = require 'react-dom'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
FEATURED_PROJECT_IDS = require '../../lib/featured-projects'

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
          ReactDOM.findDOMNode(@refs.description).classList.add 'appearing'
          @setState index: (@state.index + 1) % @state.projects.length
      , 5000

      @setState {projects, timer}

  componentWillUnmount: ->
    clearInterval(@state.timer) if @state.timer
    @setState timer: null

  loadProjects: ->
    apiClient.type('projects').get(id: FEATURED_PROJECT_IDS, cards: true, include: 'background,avatar').then (projects) =>
      Promise.all(projects.map (project) =>
        project.get 'background'
          .then ([background]) =>
            project.image = background.src
            project
          .catch =>
            project.image = project.avatar_src
            project
      )

  hovered: ->
    hovered = true

  unhovered: ->
    hovered = false

  setIndex: (i) ->
    =>
      @setState(index: i) if i >= 0 and i < @state.projects.length

  render: ->
    project = @state.projects[@state.index]
    return <div /> unless project
    @refs?.description?.classList?.add 'appearing'
    background = project.image or './assets/default-project-background.jpg'

    setTimeout =>
      ReactDOM.findDOMNode(@refs.description).classList.remove 'appearing'
    , 100

    <section className="home-promoted" style={backgroundImage: "url(#{background})"} onMouseEnter={@hovered} onMouseLeave={@unhovered}>
      <h1>{project.display_name}</h1>

      <div><p ref="description" className="description">{project.description}</p></div>

      <h2>
        <Link to={"/projects/#{project.slug}"} className="standard-button">Join our team</Link>
      </h2>

      <div className="controls">
        <i className="fa fa-angle-left" onClick={@setIndex(@state.index - 1)} />
        {for promotedProject, i in @state.projects
          if promotedProject.id is project.id
            <i key={"promoted-project-#{promotedProject.id}"} className="fa fa-circle" />
          else
            <i key={"promoted-project-#{promotedProject.id}"} className="fa fa-circle-o" onClick={@setIndex(i)} />}
        <i className="fa fa-angle-right" onClick={@setIndex(@state.index + 1)} />
      </div>
    </section>
