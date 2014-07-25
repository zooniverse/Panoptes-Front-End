React = require 'react'
request = require '../lib/request'
ChildRouter = require 'react-child-router'
{Link} = ChildRouter
LoadingIndicator = require '../components/loading-indicator'

module.exports = React.createClass
  displayName: 'ProjectPage'

  componentDidMount: ->
    @loadProject @props.name

  loadProject: (name) ->
    request.get '/projects', {name}, (error, {projects}) =>
      @setState project: projects[0]

  render: ->
    @transferPropsTo if @state?.project?
      <div className="project-page tabbed-content" data-side="top">
        <br />
        <nav className="tabbed-content-tabs">
          <Link href="#/projects/#{@state.project.owner_login}/#{@state.project.name}" className="tabbed-content-tab"><h2>{@state.project.name}</h2></Link>
          <Link href="#/projects/#{@state.project.owner_login}/#{@state.project.name}/science" className="tabbed-content-tab">Science</Link>
          <Link href="#/projects/#{@state.project.owner_login}/#{@state.project.name}/status" className="tabbed-content-tab">Status</Link>
          <Link href="#/projects/#{@state.project.owner_login}/#{@state.project.name}/crew" className="tabbed-content-tab">Crew</Link>
          <Link href="#/projects/#{@state.project.owner_login}/#{@state.project.name}/classify" className="tabbed-content-tab">Classify</Link>
        </nav>

        <ChildRouter>
          <div hash="#/projects/:owner/:name" className="content-container">
            <p>Introduction to this project</p>
          </div>

          <div hash="#/projects/:owner/:name/science" className="content-container">
            <p>Science case. What are we doing with the data?</p>
          </div>

          <div hash="#/projects/:owner/:name/status" className="content-container">
            <p>Status dashboard for this project</p>
          </div>

          <div hash="#/projects/:owner/:name/crew" className="content-container">
            <p>Who’s in charge of this project? What organizations are behind it?</p>
          </div>

          <div hash="#/projects/:owner/:name/classify" className="content-container">
            <p>Classification interface for this project</p>
          </div>
        </ChildRouter>
      </div>

    else
      <div className="content-container">
        <LoadingIndicator />
      </div>
