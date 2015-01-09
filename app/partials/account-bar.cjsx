React = require 'react'
{Link} = require 'react-router'
auth = require '../api/auth'

module.exports = React.createClass
  displayName: 'AccountBar'

  render: ->
    <div className="account-bar main-header-group">
      <Link to="build" className="main-header-item"><i className="fa fa-flask"></i></Link>

      <div className="main-header-item">
        <a href="#/users/#{@props.user.display_name}">{@props.user.display_name}</a>
        &nbsp;
        <span className="pill"><button type="button" onClick={@handleSignOutClick}>Sign out</button></span>
        <img src={@props.user.avatar} className="account-bar-avatar" />
      </div>
    </div>

  handleSignOutClick: ->
    auth.signOut()
