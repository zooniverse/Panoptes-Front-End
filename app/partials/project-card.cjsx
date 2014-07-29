# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'ProjectCard'

  render: ->
    <a href="#/projects/#{@props.owner_name}/#{@props.title}" className="project-card">
      <div className="media">
        <img src={@props.avatar} className="avatar" />
      </div>

      <div className="details">
        <div className="owner">{@props.owner_name}</div>
        <div className="title">{@props.title}</div>
        <div className="description">{@props.description}</div>
      </div>
    </a>
