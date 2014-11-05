React = require 'react'
projectsStore = require '../data/projects'
Route = require '../lib/route'
Link = require '../lib/link'
Markdown = require '../components/markdown'
ClassifyPage = require './classify'
LoadingIndicator = require '../components/loading-indicator'
Dashboard = require './dashboard'

ProjectPage = React.createClass
  displayName: 'ProjectPage'

  getInitialState: ->
    project: null

  componentWillMount: ->
    document.documentElement.classList.add 'on-project-page'
    @loadProject @props.owner, @props.project

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-project-page'

  componentWillReceiveProps: (nextProps) ->
    {owner, project} = nextProps

    sameOwner = owner is @state.project?.owner_name
    sameName = project is @state.project?.name

    unless sameOwner and sameName
      @loadProject owner, project

  loadProject: (owner, project) ->
    query =
      owner_name: owner
      name: project

    get = projectsStore.get query, 1

    get.then ([project]) =>
      setTimeout @setState.bind this, {project}

    get.catch (error) ->
      console?.error 'Error getting project', JSON.stringify(query), error

  render: ->
    owner = @state.project?.owner_name ? @props.owner
    name = @state.project?.name ? @props.project

    qualifiedProjectName = "#{owner}/#{name}"

    defaultImgSrc = '//placehold.it/1.png' # TODO: Add in a completely transparent PNG.

    <div className="project-page tabbed-content" data-side="top" style={backgroundImage: "url(#{@state.project?.background_image ? defaultImgSrc})"}>
      <div className="background-cover"></div>

      <nav className="tabbed-content-tabs">
        <Link href="/projects/#{qualifiedProjectName}" root={true} className="home tabbed-content-tab">
          <h2><img src={@state.project?.avatar ? defaultImgSrc} className="project-avatar"/>{name}</h2>
        </Link>
        <Link href="/projects/#{qualifiedProjectName}/science" className="tabbed-content-tab">Science</Link>
        <Link href="/projects/#{qualifiedProjectName}/status" className="tabbed-content-tab">Status</Link>
        <Link href="/projects/#{qualifiedProjectName}/team" className="tabbed-content-tab">Team</Link>
        <Link href="/projects/#{qualifiedProjectName}/classify" className="classify tabbed-content-tab">Classify</Link>
        <Link href="/projects/#{qualifiedProjectName}/talk" className="tabbed-content-tab"><i className="fa fa-comments"></i></Link>
      </nav>

      {if @state.project?
        <div className="project-page-content">
          <Route path="/projects/:owner/:name" className="project-home-content">
            <div className="call-to-action-container content-container">
              <Markdown className="description">{@state.project.description}</Markdown>
              <div>
                <a href="#/projects/#{qualifiedProjectName}/classify" className="call-to-action">Get started <i className="fa fa-arrow-circle-right"></i></a>
              </div>
            </div>

            <Markdown className="introduction content-container">
              {@state.project.introduction}
            </Markdown>
          </Route>

          <Route path="/projects/:owner/:name/science" className="project-text-content content-container">
            <Markdown>
              {@state.project.science_case}
            </Markdown>
          </Route>

          <Route path="/projects/:owner/:name/status" className="project-text-content content-container">
            <div>
              <Dashboard project={@state.project} />
            </div>
          </Route>

          <Route path="/projects/:owner/:name/team" className="project-text-content content-container">
            <div>
              <p>Who’s in charge of this project? What organizations are behind it?</p>
            </div>
          </Route>

          <Route path="/projects/:owner/:name/classify" className="classify-content content-container">
            <ClassifyPage project={@state.project.id} />
          </Route>

          <Route path="/projects/:owner/:name/talk" className="project-text-content content-container">
            <div>
              <p>Discussion boards this project</p>
            </div>
          </Route>
        </div>

      else
        <div className="content-container">
          <p>Loading project {qualifiedProjectName}</p>
        </div>}
    </div>

module.exports = React.createClass
  displayName: 'ProjectPageContainer'

  render: ->
    <ProjectPage owner={@props.route.params.owner} project={@props.route.params.name} />
