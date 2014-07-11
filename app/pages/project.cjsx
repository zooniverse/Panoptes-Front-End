React = require 'react'
request = require '../lib/request'
ChildRouter = require 'react-child-router'

module.exports = React.createClass
  displayName: 'ProjectPage'

  getInitialState: ->
    project: null

  componentDidMount: ->
    @loadProject @props.name

  componentWillUnmount: ->

  loadProject: (name) ->
    request.get '/projects', {name}, (error, {projects}) =>
      @setState project: projects[0]

  render: ->
    @transferPropsTo if @state.project?
      <ChildRouter className="project-page">
        <nav>
          <a href="#/projects/#{@state.project.name}">{@state.project.name}</a>
          |
          <a href="#/projects/#{@state.project.name}/science">Science</a>
          |
          <a href="#/projects/#{@state.project.name}/status">Status</a>
          |
          <a href="#/projects/#{@state.project.name}/crew">Crew</a>
          |
          <a href="#/projects/#{@state.project.name}/classify">Classify</a>
        </nav>

        <div hash="#/projects/:name">
          <p>Introduction to this project</p>
        </div>

        <div hash="#/projects/:name/science">
          <p>Science case. What are we doing with the data?</p>
        </div>

        <div hash="#/projects/:name/status">
          <p>Status dashboard for this project</p>
        </div>

        <div hash="#/projects/:name/crew">
          <p>Who’s in charge of this project? What organizations are behind it?</p>
        </div>

        <div hash="#/projects/:name/classify">
          <p>Classification interface for this project</p>
        </div>
      </ChildRouter>
    else
      <div>Loading {@props.params.name}</div>
