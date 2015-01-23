React = require 'react'
apiClient = require '../api/client'
PromiseToSetState = require '../lib/promise-to-set-state'
Markdown = require '../components/markdown'

UserProfileHeader = React.createClass
  displayName: 'UserProfileHeader'

  render: ->
    <div className="user-profile-header content-container columns-container">
      <div><img src={@props.user.avatar ? ''} className="avatar" /></div>

      <div>
        <span className="credited-name">{@props.user.real_name || @props.user.display_name}</span>

        {if @props.user.real_name
          <span className="display-name">({@props.user.display_name})</span>}

        {if @props.user.location
          <div className="location"><i className="fa fa-map-marker"></i> {@props.user.location}</div>}

        <div className="external-links">
          {if @props.user.website
            <div><i className="fa fa-globe"></i> <a href={@props.user.website}>{@props.user.website.split('//')[1]}</a></div>}

          {if @props.user.twitter
            <div><i className="fa fa-twitter"></i> <a href="https://twitter.com/#{@props.user.twitter}">{@props.user.twitter}</a></div>}
        </div>
      </div>

      <hr />

      <div className="stats">
        <p>Misc. user stats go here.</p>
      </div>
    </div>

UserProfileSubpages = React.createClass
  displayName: 'UserProfileSubpages'

  render: ->
    <div className="user-profile-subpages tabbed-content" data-side="top">
      <div className="tabbed-content-tabs">
        <a href="#/TODO/users/#{@props.user.login}" className="active tabbed-content-tab">Bio</a>
        <a href="#/TODO/users/#{@props.user.login}/activity" className="tabbed-content-tab">Activity</a>
        <a href="#/TODO/users/#{@props.user.login}/collections" className="tabbed-content-tab">Collections</a>
        <a href="#/TODO/users/#{@props.user.login}/projects" className="tabbed-content-tab">Projects</a>
        <a href="#/TODO/users/#{@props.user.login}/talk" className="tabbed-content-tab"><i className="fa fa-comments"></i></a>
      </div>

      <div className="content-container">
        <Markdown>{@props.user.bio}</Markdown>
        <hr />
        <p>Timeline of this user’s recent activity</p>
        <hr />
        <p>Collections this user has created</p>
        <hr />
        <p>Projects this user has created or has a special role in</p>
        <hr />
        <p>Your private messages with this user</p>
      </div>
    </div>

UserProfile = React.createClass
  displayName: 'UserProfile'

  render: ->
    <div className="user-profile">
      {if @props.user instanceof Promise
        <div className="content-container">
          <p>Loading {@props.login}...</p>
        </div>

      else if @props.user instanceof Error
        <div className="content-container">
          <p>Error finding {@props.login}:</p>
          <p>{@props.user.toString()}</p>
        </div>

      else if @props.user?
        <div>
          <UserProfileHeader user={@props.user} />
          <UserProfileSubpages user={@props.user} />
        </div>

      else
        <div className="content-container">
          <p>No user {@props.login} exists.</p>
        </div>}
    </div>

module.exports = React.createClass
  displayName: 'UserProfilePage'
  mixins: [PromiseToSetState]

  componentDidMount: ->
    @loadUser @props.params.name

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.params.name is @props.params.name
      @loadUser nextProps.params.name

  loadUser: (name) ->
    @promiseToSetState user: apiClient.createType('users').get(display_name: name, 1).then ([user]) ->
      user

  render: ->
    if @state.user?.id?
      <div>
        <strong><i className="fa fa-exclamation-triangle"></i> Placeholder</strong>
        <UserProfile user={@state.user} />
      </div>
    else
      null
