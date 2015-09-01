React = require 'react'
{Link} = require 'react-router'
ClassificationsRibbon = require '../../components/classifications-ribbon'
PromiseRenderer = require '../../components/promise-renderer'

ProjectIcon = React.createClass
  displayName: 'ProjectIcon'

  getDefaultProps: ->
    project: null
    badge: ''
    defaultAvatarSrc: '/assets/simple-avatar.jpg'

  getInitialState: ->
    href: ''
    avatar: null

  componentDidMount: ->
    @getDetails @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @getDetails nextProps.project

  getDetails: (project) ->
    project.get 'owner'
      .then (owner) =>
        @setState {owner}
    project.get 'avatar'
      .catch =>
        null
      .then (avatar) =>
        @setState {avatar}

  render: ->
    content = [
      <img key="image" src={@state.avatar?.src ? @props.defaultAvatarSrc} />
      <div key="label" className="label">
        <span className="owner">{@state.owner?.display_name}</span><br />
        <span className="display-name"><strong>{@props.project.display_name}</strong></span>
      </div>
      <div key="badge" className="badge">{@props.badge}</div> if @props.badge
    ]

    if !!@props.project.redirect
      <a href={@props.project.redirect} className="stats-project-icon">{content}</a>
    else
      [owner, name] = @props.project.slug.split '/'
      <Link to="project-home" params={owner: owner, name: name} className="stats-project-icon">{content}</Link>

module.exports = React.createClass
  getDefaultProps: ->
    user: null

  render: ->
    <div className="content-container">
      <h3>Your contribution stats</h3>
      <p className="form-help">Users can only view their own stats.</p>
      {if @props.profileUser is @props.user
        # TODO: Braces after "style" here confuse coffee-reactify. That's really annoying.
        centered = textAlign: 'center'
        <div style=centered>
          <p><ClassificationsRibbon user={@props.profileUser} /></p>
          <PromiseRenderer promise={ClassificationsRibbon::getAllProjectPreferences @props.profileUser} then={(projectPreferences) =>
            <div>
              {projectPreferences.map (projectPreference) =>
                <PromiseRenderer key={projectPreference.id} promise={projectPreference.get 'project'} catch={null} then={(project) =>
                  if project?
                    <span>
                      <ProjectIcon project={project} badge={projectPreference.activity_count} />
                      &ensp;
                    </span>
                  else
                    null
                } />}
            </div>
          } />
        </div>
      else
        <p>Sorry, we can’t show you stats for {@props.user.display_name}.</p>}
    </div>
