React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
ChangeListener = require '../components/change-listener'
{Link} = require 'react-router'
auth = require '../api/auth'
talkClient = require '../api/talk'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
Avatar = require '../partials/avatar'

counterpart.registerTranslations 'en',
  accountMenu:
    profile: 'Profile'
    settings: 'Settings'
    signOut: 'Sign Out'
    collections: 'Collections'

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
    <ChangeListener target={@props.user} handler={=>
      <div className="account-bar">
        <div className="account-info">
          <span className="display-name"><strong>{@props.user.display_name}</strong></span>
          <Avatar user={@props.user} />
          <Link to="inbox" params={name: @props.user.login} className="message-link"><i className="fa fa-envelope#{if @state.unread then '' else '-o'}" /> </Link>
        </div>
        <div className="account-menu" ref="accountMenu">
          <Link to="settings" params={name: @props.user.login}><Translate content="accountMenu.settings" /></Link>
          <Link to="collections-user" params={{owner: @props.user.login}}>
            <Translate content="accountMenu.collections" />
          </Link>
          <button className="secret-button sign-out-button" type="button" onClick={@handleSignOutClick}><Translate content="accountMenu.signOut" /></button>
        </div>
      </div>
    } />

  handleSignOutClick: ->
    auth.signOut()

  toggleAccountMenu: ->
    accountMenu = @refs.accountMenu
    React.findDOMNode(accountMenu).classList.toggle 'show'
