# @cjsx React.DOM

React = require 'react'
ProjectCardList = require '../partials/project-card-list'

module.exports = React.createClass
  displayName: 'ProjectsPage'

  render: ->
    categories = @props?.params?.categories?.split '+'
    categories ?= ['*']

    <div className="projects-page">
      <div className="content-container">
        <h1>Projects</h1>
        <p>Nostrud elit laborum aliquip elit id aliquip minim et velit ex mollit ipsum enim quis.</p>
      </div>
      <hr />
      <div className="content-container">
        <ProjectCardList query={{categories}} />
      </div>
    </div>
