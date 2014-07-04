# @cjsx React.DOM

React = require 'react'
currentUserActions = require '../actions/current-user'

module.exports = React.createClass
  displayName: 'AccountBar'

  getDefaultProps: ->
    user: null

  render: ->
    isCool = @props.user?.preferences.cool ? false
    <div className="account-bar">
      <a href="#/edit/account">{@props.user.real_name}</a>
      <img src={@props.user.avatar} className="avatar" />
      <button type="button" onClick={currentUserActions.signOut}>Sign out</button>
      <button onClick={currentUserActions.setPreference.bind null, 'cool', not isCool}>Toggle cool</button>
      Currently {isCool.toString()}.
    </div>
