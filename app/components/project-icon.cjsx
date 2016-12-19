React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
ProjectCard = require '../partials/project-card'

module.exports = React.createClass
  displayName: 'ProjectIcon'

  getDefaultProps: ->
    project: null
    badge: ''
    defaultAvatarSrc: '/assets/simple-avatar.png'
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
    if project.avatar_src
      @setState avatar: "//#{ project.avatar_src }"
    else
      @setState avatar: '/assets/simple-avatar.jpg'

  render: ->
    <span className="stats-project-icon">
      <ProjectCard project={@props.project} />
      {<div className="badge">{@props.badge}</div> if @props.badge}
    </span>
