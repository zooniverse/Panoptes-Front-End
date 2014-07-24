# @cjsx React.DOM

GALAXY_ZOO =
  id: 'GZ'
  owner_login: 'Zooniverse'
  title: 'Galaxy Zoo'
  avatar: 'https://pbs.twimg.com/profile_images/2597266958/image.jpg'
  description: 'Help learn about galaxy formation, and help learn about galaxy formation, and help learn about galaxy formation.'
  total_subjects: 1000000
  retired_subjects: 666667

React = require 'react'
ProjectCard = require './project-card'
LoadingIndicator = require '../components/loading-indicator'

module.exports = React.createClass
  displayName: 'ProjectCardList'

  fetch: (query, callback) ->
    console?.info 'Fetching projects to build a project card list', JSON.stringify(query)
    setTimeout callback?.bind(null, null, [GALAXY_ZOO, GALAXY_ZOO, GALAXY_ZOO, GALAXY_ZOO, GALAXY_ZOO]), 1000

  componentWillMount: ->
    if @props.query?
      @fetch @props.query, (error, projects) =>
        @setState {projects}

  render: ->
    if @state?.projects?
      projectCards = for project in @state.projects
        new ProjectCard project

      @transferPropsTo <div className="project-card-list">
        {@props.children}
        {projectCards}
      </div>

    else
      <LoadingIndicator />
