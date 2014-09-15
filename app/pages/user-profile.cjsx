# @cjsx React.DOM

React = require 'react'
PromiseToSetState = require '../lib/promise-to-set-state'
usersStore = require '../data/users'
Route = require '../lib/route'
Link = require '../lib/link'
Markdown = require '../components/markdown'
LoadingIndicator = require '../components/loading-indicator'

module.exports = React.createClass
  displayName: 'UserProfilePage'
  mixins: [PromiseToSetState]

  componentDidMount: ->
    @promiseToSetState user: usersStore.get login: @props.route.params.login, 1

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.route.params.login is @props.route.params.login
      @promiseToSetState user: usersStore.get login: nextProps.route.params.login, 1

  render: ->
    if @state.user instanceof Promise
      <div className="content-container">
        <p>Loading {@props.route.params.login}...</p>
      </div>

    else if @state.user instanceof Error
      <div className="content-container">
        <p>Error finding {@props.route.params.login}:</p>
        <p>{@state.user.toString()}</p>
      </div>

    else if @state.user?.length is 0
      <div className="content-container">
        <p>No user “{@props.route.params.login}” exists.</p>
      </div>

    else if @state.user?
      [user] = @state.user

      <div>
        <div className="user-header owner-header content-container columns-container #{pendingClass ? ''}">
          <div>
            <img src={user.avatar ? ''} className="avatar" />
          </div>

          <div>
            <span className="credited-name">
              {user.real_name || user.display_name}
            </span>

            {if user.real_name
              <span className="display-name">({user.display_name})</span>}

            {if user.location
              <div className="location">
                <i className="fa fa-map-marker"></i> {user.location}
              </div>}

            <div className="external-links">
              {if user.website
                <div>
                  <i className="fa fa-globe"></i> <a href={user.website}>{user.website.split('//')[1]}</a>
                </div>}

              {if user.twitter
                <div>
                  <i className="fa fa-twitter"></i> <a href="https://twitter.com/#{user.twitter}">{user.twitter}</a>
                </div>}
            </div>
          </div>

          <hr />

          <div className="stats">
            <p>Misc. user stats go here.</p>
          </div>
        </div>

        <div className="user-details">
          <div className="tabbed-content" data-side="top">
            <div className="tabbed-content-tabs">
              <Link href="/users/#{user.login}" root={true} className="tabbed-content-tab">Bio</Link>
              <Link href="/users/#{user.login}/activity" className="tabbed-content-tab">Activity</Link>
              <Link href="/users/#{user.login}/collections" className="tabbed-content-tab">Collections</Link>
              <Link href="/users/#{user.login}/projects" className="tabbed-content-tab">Projects</Link>
              <Link href="/users/#{user.login}/talk" className="tabbed-content-tab"><i className="fa fa-comments"></i></Link>
            </div>

            <div className="content-container">
              <Route path="/users/#{user.login}">
                {if user?
                  <Markdown>{user.bio}</Markdown>
                else
                  <LoadingIndicator />}
              </Route>

              <Route path="/users/#{user.login}/activity">
                <p>Timeline of this user’s recent activity</p>
              </Route>

              <Route path="/users/#{user.login}/collections">
                <p>Collections this user has created</p>
              </Route>

              <Route path="/users/#{user.login}/projects">
                <p>Projects this user has created or has a special role in</p>
              </Route>

              <Route path="/users/#{user.login}/talk">
                <p>Your private messages with this user</p>
              </Route>
            </div>
          </div>
        </div>
      </div>

    else
      null
