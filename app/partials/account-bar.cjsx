React = require 'react'
{Link} = require 'react-router'
auth = require '../api/auth'
talkClient = require '../api/talk'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'

counterpart.registerTranslations 'en',
  accountMenu:
    profile: 'Profile'
    settings: 'Settings'
    signOut: 'Sign Out'


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
      <div className="account-info">
        <span className="display-name"><strong>{@props.user.display_name}</strong></span>
        <img src={@props.user.avatar} className="avatar" />
        <Link to="inbox"><i className="fa fa-envelope#{if @state.unread then '' else '-o'}" /> </Link>
      </div>
      <div className="account-menu" ref="accountMenu">
        <Link to="user-profile" params={name: @props.user.display_name}><Translate content="accountMenu.profile" /></Link>
        <Link to="settings"><Translate content="accountMenu.settings" /></Link>
        <button className="secret-button" type="button" onClick={@handleSignOutClick}><Translate content="accountMenu.signOut" /></button>
      </div>
    </div>

  handleSignOutClick: ->
    auth.signOut()

  toggleAccountMenu: ->
    accountMenu = @refs.accountMenu
    React.findDOMNode(accountMenu).classList.toggle 'show'
