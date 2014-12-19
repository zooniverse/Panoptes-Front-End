React = require 'react'
Route = require '../lib/route'
Link = require '../lib/link'
Markdown = require '../components/markdown'
ClassifyPage = require './classify'
LoadingIndicator = require '../components/loading-indicator'
Dashboard = require './dashboard'

ProjectPage = React.createClass
  displayName: 'ProjectPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-project-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-project-page'

  render: ->
    <div className="project-page tabbed-content" data-side="top" style={backgroundImage: "url(#{@props.project.background_image})" if @props.project.background_image}>
      <div className="background-darkener"></div>

      <nav className="tabbed-content-tabs">
        <Link href="/projects/#{@props.project.display_name}" root={true} className="home tabbed-content-tab">
          <h2><img src={@props.project.avatar} className="project-avatar" />{@props.project.display_name}</h2>
        </Link>
        <Link href="/projects/#{@props.project.display_name}/science" className="tabbed-content-tab">Science</Link>
        <Link href="/projects/#{@props.project.display_name}/status" className="tabbed-content-tab">Status</Link>
        <Link href="/projects/#{@props.project.display_name}/team" className="tabbed-content-tab">Team</Link>
        <Link href="/projects/#{@props.project.display_name}/classify" className="classify tabbed-content-tab">Classify</Link>
        <Link href="/projects/#{@props.project.display_name}/talk" className="tabbed-content-tab"><i className="fa fa-comments"></i></Link>
      </nav>

      <div className="project-page-content">
        <Route path="/projects/#{@props.project.display_name}" className="project-home-content">
          <div className="call-to-action-container content-container">
            <Markdown className="introduction">{@props.project.introduction}</Markdown>
            <div>
              <a href="#/projects/#{@props.project.display_name}/classify" className="call-to-action">Get started <i className="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>

          <Markdown className="description content-container">
            {@props.project.description}
          </Markdown>
        </Route>

        <Route path="/projects/#{@props.project.display_name}/science" className="project-text-content content-container">
          <Markdown>
            {@props.project.science_case}
          </Markdown>
        </Route>

        <Route path="/projects/#{@props.project.display_name}/status" className="project-text-content content-container">
          <div>
            <hr Dashboard project={@props.project} />
          </div>
        </Route>

        <Route path="/projects/#{@props.project.display_name}/team" className="project-text-content content-container">
          <div>
            <p>Who’s in charge of this project? What organizations are behind it?</p>
          </div>
        </Route>

        <Route path="/projects/#{@props.project.display_name}/classify" className="classify-content content-container">
          <ClassifyPage project={@props.project} />
        </Route>

        <Route path="/projects/#{@props.project.display_name}/talk" className="project-text-content content-container">
          <div>
            <p>Discussion boards this project</p>
          </div>
        </Route>
      </div>
    </div>

apiClient = window.api = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'

module.exports = React.createClass
  displayName: 'ProjectPageContainer'

  render: ->
    project = apiClient.createType('projects').get @props.route.params.id # By-ID a is temporary workaround for router weirdness.
      # .then ([project]) ->
      #   project?.refresh()

    <PromiseRenderer promise={project} then={@renderProjectPage}>
      <p>Loading project <code>{@props.route.params.name}</code>...</p>
    </PromiseRenderer>

  renderProjectPage: (project) ->
    if project?
      <ProjectPage project={project} />
    else
      throw new Error "No project '#{@props.route.params.name}' found"
