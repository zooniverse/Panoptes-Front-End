React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'ProjectCard'

  render: ->
    <PromiseRenderer promise={@props.project.link 'owner'} then={@renderWithOwner}>
      {@renderWithOwner {}}
    </PromiseRenderer>

  renderWithOwner: (owner) ->
    <Link to="project-home" params={owner: owner.display_name ? '?', display_name: @props.project.display_name} className="project-card">
      <div className="media">
        <img src={@props.project.avatar} className="avatar" />
      </div>

      <div className="details">
        <div className="owner">{owner.display_name}</div>
        <div className="title">{@props.project.display_name}</div>
        <div className="introduction">{@props.project.introduction}</div>
      </div>
    </Link>
