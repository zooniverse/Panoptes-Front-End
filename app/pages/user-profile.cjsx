# @cjsx React.DOM

React = require 'react'
usersStore = require '../data/users'
{dispatch} = require '../lib/dispatcher'
ChildRouter = require 'react-child-router'
{Link} = ChildRouter
Markdown = require '../components/markdown'
LoadingIndicator = require '../components/loading-indicator'

UserHeader = React.createClass
  displayName: 'UserHeader'

  mixins: [
    usersStore.mixInto -> user: usersStore.users[@props.login]
  ]

  render: ->
    <div className="user-header owner-header content-container columns-container">
      <div>
        <img src={@state.user?.avatar ? ''} className="avatar" />
      </div>

      <div>
        <span className="credited-name">
          {@state.user?.credited_name || @state.user?.display_name}
        </span>

        {if @state.user?.credited_name
          <span className="display-name">({@state.user.display_name})</span>}

        {if @state.user?.location
          <div className="location">
            <i className="fa fa-map-marker"></i> {@state.user.location}
          </div>}

        <div className="external-links">
          {if @state.user?.website
            <div>
              <i className="fa fa-globe"></i> <a href={@state.user.website}>{@state.user.website.split('//')[1]}</a>
            </div>}

          {if @state.user?.twitter
            <div>
              <i className="fa fa-twitter"></i> <a href="https://twitter.com/#{@state.user.twitter}">{@state.user.twitter}</a>
            </div>}
        </div>
      </div>

      <hr />

      <div className="stats">
        <p>Misc. user stats go here.</p>
      </div>
    </div>

UserDetails = React.createClass
  displayName: 'UserDetails'

  mixins: [
    usersStore.mixInto -> user: usersStore.users[@props.login]
  ]

  render: ->
    <div className="user-details">
      <div className="tabbed-content" data-side="top">
        <div className="tabbed-content-tabs">
          <Link href="#/users/#{@props.login}" className="tabbed-content-tab">Bio</Link>
          <Link href="#/users/#{@props.login}/activity" className="tabbed-content-tab">Activity</Link>
          <Link href="#/users/#{@props.login}/collections" className="tabbed-content-tab">Collections</Link>
          <Link href="#/users/#{@props.login}/projects" className="tabbed-content-tab">Projects</Link>
          <Link href="#/users/#{@props.login}/talk" className="tabbed-content-tab"><i className="fa fa-comments"></i></Link>
        </div>

        <ChildRouter className="content-container">
          <div hash="#/users/#{@props.login}">
            {if @state.user?
              <Markdown>{@state.user.bio}</Markdown>
            else
              <LoadingIndicator />}
          </div>

          <div hash="#/users/#{@props.login}/activity">
            <p>Timeline of this user’s recent activity</p>
          </div>

          <div hash="#/users/#{@props.login}/collections">
            <p>Collections this user has created</p>
          </div>

          <div hash="#/users/#{@props.login}/projects">
            <p>Projects this user has created or has a special role in</p>
          </div>

          <div hash="#/users/#{@props.login}/talk">
            <p>Your private messages with this user</p>
          </div>
        </ChildRouter>
      </div>
    </div>

module.exports = React.createClass
  displayName: 'UserProfilePage'

  componentWillMount: ->
    dispatch 'users:get', login: @props.params.login

  render: ->
    <div className="user-profile-page">
      <UserHeader login={@props.params.login} />
      <UserDetails login={@props.params.login} />
    </div>
