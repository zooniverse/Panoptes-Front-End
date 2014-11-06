# @cjsx React.DOM

React = require 'react'
{dispatch} = require '../lib/dispatcher'
Link = require '../lib/link'
currentUserMixin = require '../lib/current-user'

module.exports = React.createClass
  displayName: 'AccountBar'

  mixins: [currentUserMixin]

  render: ->
    <div className="account-bar main-header-group">
      <Link href="/build" className="main-header-item"><i className="fa fa-flask"></i></Link>

      <Link href="/timeline" className="main-header-item">
        <i className="fa fa-bell"></i>
        {@state.currentUser?.unseen_events if @isSignedIn() and @state.currentUser?.unseen_events}
      </Link>

      <div className="main-header-item">
        <a href="#/users/#{@state.currentUser?.display_name}">{@state.currentUser?.display_name}</a>
        &nbsp;
        <Link href="/settings"><i className="fa fa-cog"></i></Link>
        <span className="pill"><button type="button" onClick={@handleSignOut}>Sign out</button></span>
        <img src={@state.currentUser?.avatar} className="account-bar-avatar" />
      </div>
    </div>
