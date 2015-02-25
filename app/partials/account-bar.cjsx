React = require 'react'
{Link} = require 'react-router'
auth = require '../api/auth'

module.exports = React.createClass
  displayName: 'AccountBar'

  render: ->
    <div className="account-bar">
      <img src={@props.user.avatar} className="avatar" />{' '}
      <strong><Link to="user-profile" params={name: @props.user.display_name}>{@props.user.display_name}</Link></strong>{' '}
      <button type="button" className="pill-button" onClick={@handleSignOutClick}>Sign out</button>{' '}
      <Link to="settings" className="pill-button">Settings</Link>
    </div>

  handleSignOutClick: ->
    auth.signOut()
