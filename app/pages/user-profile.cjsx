React = require 'react'
PromiseToSetState = require '../lib/promise-to-set-state'
usersStore = require '../data/users'
Route = require '../lib/route'
Link = require '../lib/link'
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
        <Link href="/users/#{@props.user.login}" root={true} className="tabbed-content-tab">Bio</Link>
        <Link href="/users/#{@props.user.login}/activity" className="tabbed-content-tab">Activity</Link>
        <Link href="/users/#{@props.user.login}/collections" className="tabbed-content-tab">Collections</Link>
        <Link href="/users/#{@props.user.login}/projects" className="tabbed-content-tab">Projects</Link>
        <Link href="/users/#{@props.user.login}/talk" className="tabbed-content-tab"><i className="fa fa-comments"></i></Link>
      </div>

      <div className="content-container">
        <Route path="/users/#{@props.user.login}">
          <Markdown>{@props.user.bio}</Markdown>
        </Route>

        <Route path="/users/#{@props.user.login}/activity">
          <p>Timeline of this user’s recent activity</p>
        </Route>

        <Route path="/users/#{@props.user.login}/collections">
          <p>Collections this user has created</p>
        </Route>

        <Route path="/users/#{@props.user.login}/projects">
          <p>Projects this user has created or has a special role in</p>
        </Route>

        <Route path="/users/#{@props.user.login}/talk">
          <p>Your private messages with this user</p>
        </Route>
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
    @promiseToSetState user: usersStore.get login: @props.route.params.login, 1

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.route.params.login is @props.route.params.login
      @promiseToSetState user: usersStore.get login: nextProps.route.params.login, 1

  render: ->
    user = if @state.user instanceof Array
      @state.user[0]
    else
      @state.user

    <UserProfile login={@props.route.params.login} user={user} section={@props.route.params.section} />
