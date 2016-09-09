React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'

module.exports = React.createClass
  displayName: 'ProjectIcon'

  getDefaultProps: ->
    project: null
    badge: ''
    defaultAvatarSrc: '/assets/simple-avatar.jpg'
    onClick: null
    linkTo: true

  getInitialState: ->
    href: ''
    avatar: null

  componentDidMount: ->
    @getDetails @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @getDetails nextProps.project

  getDetails: (project) ->
    apiClient.type 'avatars'
      .get project.links.avatar.id
      .then (avatar) =>
        @setState {avatar}
      .catch =>
        project.get 'avatar'
          .catch =>
            null
          .then (avatar) =>
            @setState {avatar}

  render: ->
    content = [
      <img key="image" alt="" src={@state.avatar?.src ? @props.defaultAvatarSrc} />
      <div key="label" className="label">
        <span className="owner">{@props.project.links.owner?.display_name}</span><br />
        <span className="display-name"><strong>{@props.project.display_name}</strong></span>
      </div>
      <div key="badge" className="badge">{@props.badge}</div> if @props.badge
    ]

    if @props.linkTo
      if !!@props.project.redirect
        <a href={@props.project.redirect} className="stats-project-icon">{content}</a>
      else
        <Link to="/projects/#{@props.project.slug}" className="stats-project-icon">{content}</Link>
    else
      <span className="stats-project-icon">{content}</span>
