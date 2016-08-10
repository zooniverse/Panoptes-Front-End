React = require 'react'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'ProjectIcon'

  getDefaultProps: ->
    project: null
    badge: ''
    defaultAvatarSrc: '/assets/simple-avatar.jpg'
    onClick: null
    linkTo: true

  render: ->
    if !!@props.project.avatar_src
      src = "//#{@props.project.avatar_src}"
    else
      src = @props.defaultAvatarSrc
    content = [
      <img key="image" src={src} />
      <div key="label" className="label">
        <span className="display-name"><strong>{@props.project.display_name}</strong></span>
      </div>
      <div key="badge" className="badge">{@props.badge}</div> if @props.badge
    ]

    if @props.linkTo
      if !!@props.project.redirect
        <a href={@props.project.redirect} className="stats-project-icon">{content}</a>
      else
        [owner, name] = @props.project.slug.split '/'
        <Link to="/projects/#{owner}/#{name}" className="stats-project-icon">{content}</Link>
    else
      <span className="stats-project-icon">{content}</span>
