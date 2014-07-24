# @cjsx React.DOM

React = require 'react'
ProjectCardList = require '../partials/project-card-list'

module.exports = React.createClass
  displayName: 'ProjectsPage'

  render: ->
    categories = @props?.params?.categories?.split '+'
    categories ?= ['*']

    <div className="projects-page content-container">
      <h1>Projects</h1>
      <ProjectCardList query={{categories}} />
    </div>
