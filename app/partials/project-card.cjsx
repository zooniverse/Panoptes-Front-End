React = require 'react'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'ProjectCard'

  render: ->
    {project} = @props

    <Link to="project-home" params={id: project.id} className="project-card">
      <div className="media">
        <img src={project.avatar} className="avatar" />
      </div>

      <div className="details">
        <div className="owner">{project.owner_name}</div>
        <div className="title">{project.display_name}</div>
        <div className="introduction">{project.introduction}</div>
      </div>
    </Link>
