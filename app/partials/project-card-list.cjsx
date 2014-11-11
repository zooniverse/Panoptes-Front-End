React = require 'react'
projectsStore = require '../mock-data/projects'
ProjectCard = require './project-card'
LoadingIndicator = require '../components/loading-indicator'

module.exports = React.createClass
  displayName: 'ProjectCardList'

  getInitialState: ->
    projects: null

  componentWillMount: ->
    @fetchProjects @props.query

  componentWillReceiveProps: (nextProps) ->
    @fetchProjects nextProps.query

  fetchProjects: (query) ->
    query ?= {}
    @setState projects: projectsStore

  render: ->
    if @state.projects?.length is 0
      <div className="empty project-card-list">No matches for {JSON.stringify @props.query}</div>

    else if @state.projects?
      projectCards = for project in @state.projects
        new ProjectCard project

      <div className="project-card-list">
        {@props.children}
        {projectCards}
      </div>

    else
      <div style={textAlign: 'center'}>
        <LoadingIndicator />
      </div>
