React = require 'react'
ReactDOM = require 'react-dom'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
ZooniverseLogo = require '../../partials/zooniverse-logo'
FEATURED_PROJECTS = require '../../lib/featured-projects'
loadImage = require '../../lib/load-image'
classnames = require 'classnames'

hovered = false
projectIndex = 0
timer = null

module.exports = React.createClass
  displayName: 'HomePagePromoted'

  getInitialState: ->
    projects: []

  componentDidMount: ->
    @loadProjects().then (projects) =>
      timer = setInterval @advanceIndex, 5000
      @setState {projects}

  componentWillUnmount: ->
    clearInterval(timer) if timer

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
      projectIndex = (projectIndex + 1) % @state.projects.length
      @showCurrent()

  switchTo: (index) ->
    return if index is projectIndex
    projectIndex = if index >= 0 and index < @state.projects.length
      index
    else if index < 0
      @state.projects.length - 1
    else
      0

    clearInterval timer
    timer = setInterval @advanceIndex, 5000
    @showCurrent()

  showCurrent: ->
    promotedProjects = @refs.container.querySelector '.promoted-projects'
    promotedProjects.querySelector('.promoted-project.current')?.classList?.remove('current')
    promotedProjects.querySelector(".promoted-project:nth-child(#{projectIndex + 1})")?.classList?.add('current')

  render: ->
    return <div /> if @state.projects.length is 0

    <section ref="container" className="home-promoted" onMouseEnter={@hovered} onMouseLeave={@unhovered}>
      <div className="promoted-projects">
        {for project, index in @state.projects
          <div className={classnames 'promoted-project', current: index is 0} key={"promoted-project-#{index}"}>
            <div className="layer"></div>
            <img className="background-image" src={project.image} />
            <h1>THE ZO<ZooniverseLogo />NIVERSE</h1>

            <p className="description">{project.caption}</p>

            <i className="controls angles fa fa-angle-left" onClick={=> @switchTo(projectIndex - 1)} />
            <i className="controls angles fa fa-angle-right" onClick={=> @switchTo(projectIndex + 1)} />

            <Link to={if project.redirect then project.redirect else "/projects/#{project.slug}"} className="standard-button">Join Our Team</Link>

            <div className="controls circles">
              {for _, controlIndex in @state.projects
                <i
                  key={"promoted-project-#{index}-#{controlIndex}"}
                  className={classnames 'fa',
                    'fa-circle': index is controlIndex
                    'fa-circle-o': index isnt controlIndex}
                  onClick={@switchTo.bind(this, controlIndex)}
                />}
            </div>
            <p className="owner">Image from <strong>{project.display_name}</strong></p>
          </div>}
      </div>
    </section>
