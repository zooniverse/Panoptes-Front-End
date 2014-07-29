# @cjsx React.DOM

React = require 'react'
ProjectCard = require './project-card'
LoadingIndicator = require '../components/loading-indicator'

EXAMPLE_PROJECTS =
  for i in [0...5]
    id: Math.random().toString().split('.')[1]
    owner_name: 'Zooniverse'
    title: 'Galaxy Zoo'
    avatar: 'https://pbs.twimg.com/profile_images/2597266958/image.jpg'
    description: new Array(Math.floor Math.random() * 5).join 'Consectetur quis consequat qui velit adipisicing in aute consequat sunt do aliqua aliqua.'
    total_subjects: 1000000
    retired_subjects: 666667

module.exports = React.createClass
  displayName: 'ProjectCardList'

  fetch: (query, callback) ->
    console?.info 'Fetching projects to build a project card list', JSON.stringify(query)
    setTimeout callback?.bind(null, null, EXAMPLE_PROJECTS), 1000

  componentWillMount: ->
    if @props.query?
      @fetch @props.query, (error, projects) =>
        @setState {projects}

  render: ->
    if @state?.projects?
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
