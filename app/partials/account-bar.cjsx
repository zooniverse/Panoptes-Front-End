# @cjsx React.DOM

React = require 'react'
currentUserActions = require '../actions/current-user'

module.exports = React.createClass
  displayName: 'AccountBar'

  render: ->
    <div className="account-bar main-header-group">
      <div className="main-header-item">
        <a href="#/edit/account">{@props.user.real_name}</a>
        <span className="pill"><button type="button" onClick={currentUserActions.signOut}>Sign out</button></span>
        <img src={@props.user.avatar} className="account-bar-avatar" />
      </div>
    </div>
