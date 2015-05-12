React = require 'react'
{Link} = require 'react-router'
auth = require '../api/auth'
talkClient = require '../api/talk'

module.exports = React.createClass
  displayName: 'AccountBar'

  getInitialState: ->
    unread: false

  componentDidMount: ->
    window.addEventListener 'hashchange', @setUnread
    @setUnread()

  componentWillUnmount: ->
    window.removeEventListener 'hashchange', @setUnread

  setUnread: ->
    talkClient.type('conversations').get({user_id: @props.user.id, unread: true, page_size: 1})
      .then (conversations) =>
        @setState {unread: !!conversations.length}
      .catch (e) -> console.log "e unread messages", e

  render: ->
    <div className="account-bar">
      <strong><Link to="user-profile" params={name: @props.user.display_name}>{@props.user.display_name}</Link></strong>
      <img src={@props.user.avatar} className="avatar" />

      <Link to="inbox"><i className="fa fa-envelope#{if @state.unread then '' else '-o'}" /> </Link>
      <button type="button" className="pill-button" onClick={@handleSignOutClick}>Sign out</button>
      <Link to="settings" className="pill-button">Settings</Link>
    </div>

  handleSignOutClick: ->
    auth.signOut()
