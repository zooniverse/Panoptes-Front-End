React = require 'react'
{Link} = require 'react-router'
ClassificationsRibbon = require '../../components/classifications-ribbon'
auth = require '../../api/auth'
ChangeListener = require '../../components/change-listener'
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
    <Link to="project-home" params={owner: @state.owner?.login ? '...', name: @props.project.slug} className="stats-project-icon">
      <img src={@state.avatar?.src ? @props.defaultAvatarSrc} />
      <div className="label">
        <span className="owner">{@state.owner?.display_name}</span><br />
        <span className="display-name"><strong>{@props.project.display_name}</strong></span>
      </div>
      {if @props.badge
        <div className="badge">{@props.badge}</div>}
    </Link>

module.exports = React.createClass
  getDefaultProps: ->
    user: null

  render: ->
    <div className="content-container">
      <h3>Your contribution stats</h3>
      <p className="form-help">Users can only view their own stats.</p>
      <ChangeListener target={auth} handler={=>
        <PromiseRenderer promise={auth.checkCurrent()} then={(currentUser) =>
          if currentUser is @props.user
            # TODO: Braces after "style" here confuse coffee-reactify. That's really annoying.
            centered = textAlign: 'center'
            <div style=centered>
              <p><ClassificationsRibbon user={@props.user} /></p>
              <PromiseRenderer promise={ClassificationsRibbon::getAllProjectPreferences @props.user} then={(projectPreferences) =>
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
            <p>Sorry, we can’t show you stats for {@props.user.display_name}.</p>
        } />
      } />
    </div>
