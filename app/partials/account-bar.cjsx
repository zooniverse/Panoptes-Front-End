React = require 'react'
{Link} = require 'react-router'
auth = require '../api/auth'

module.exports = React.createClass
  displayName: 'AccountBar'

  render: ->
    <div className="account-bar">
      <strong><Link to="user-profile" params={name: @props.user.display_name}>{@props.user.display_name}</Link></strong>{' '}
      <span className="pill"><button type="button" onClick={@handleSignOutClick}>Sign out</button></span>{' '}
      <img src={@props.user.avatar} className="account-bar-avatar" />
    </div>

  handleSignOutClick: ->
    auth.signOut()
