React = require 'react'

module.exports = React.createClass
  displayName: 'ProjectCard'

  render: ->
    {project} = @props

    <a href="#/projects/#{decodeURIComponent project.id}" className="project-card">
      <div className="media">
        <img src={project.avatar} className="avatar" />
      </div>

      <div className="details">
        <div className="owner">{project.owner_name}</div>
        <div className="title">{project.display_name}</div>
        <div className="introduction">{project.introduction}</div>
      </div>
    </a>
