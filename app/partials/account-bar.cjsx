React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
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
      <PromiseRenderer promise={@props.user.get 'avatar'} then={([avatar]) =>
        <img src={avatar.src} className="avatar" />
      } catch={null} />{' '}
      <strong><Link to="user-profile" params={name: @props.user.display_name}>{@props.user.display_name}</Link></strong>&ensp;
      <Link to="inbox"><i className="fa fa-envelope#{if @state.unread then '' else '-o'}"></i></Link>&ensp;
      <Link to="settings"><i className="fa fa-cog"></i></Link>&ensp;
      <button type="button" className="pill-button" onClick={@handleSignOutClick}>Sign out</button>
    </div>

  handleSignOutClick: ->
    auth.signOut()
