# @cjsx React.DOM

React = require 'react'
currentUserActions = require '../actions/current-user'
{Link} = require 'react-child-router'

module.exports = React.createClass
  displayName: 'AccountBar'

  render: ->
    <div className="account-bar main-header-group">
      {unless @props.user.unseen_events is 0
        <Link href="#/messages" className="main-header-item">
          <i className="fa fa-bell"></i> {@props.user.unseen_events}
        </Link>}

      <div className="main-header-item">
        <a href="#/users/#{@props.user.display_name}">{@props.user.real_name}</a> <Link href="#/settings"><i className="fa fa-cog"></i></Link>
        <span className="pill"><button type="button" onClick={currentUserActions.signOut}>Sign out</button></span>
        <img src={@props.user.avatar} className="account-bar-avatar" />
      </div>
    </div>
