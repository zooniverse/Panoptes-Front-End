# @cjsx React.DOM

React = require 'react'
currentUserActions = require '../actions/current-user'

module.exports = React.createClass
  displayName: 'AccountBar'

  getDefaultProps: ->
    user: null

  render: ->
    <div className="account-bar">
      <a href="#/edit/account">{@props.user.real_name}</a>
      <button type="button" onClick={currentUserActions.signOut}>Sign out</button>
      <img src={@props.user.avatar} className="avatar" />
    </div>
