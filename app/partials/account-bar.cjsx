React = require 'react'
{Link} = require 'react-router'
auth = require '../api/auth'
talkClient = require '../api/talk'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
Avatar = require '../partials/avatar'

UP = 38
DOWN = 40

counterpart.registerTranslations 'en',
  accountMenu:
    profile: 'Profile'
    settings: 'Settings'
    signOut: 'Sign Out'
    collections: 'Collections'

module.exports = React.createClass
  displayName: 'AccountBar'

  propTypes:
    user: React.PropTypes.object.isRequired

  getInitialState: ->
    unread: false
    expanded: false

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
      <div className="account-bar" onKeyDown={@navigateMenu}>
        <div className="account-info">
          <button aria-expanded={@state.expanded} aria-haspopup="true" className="secret-button display-name" onClick={@toggleAccountMenu}>
            <strong>{@props.user.display_name}</strong>
          </button>
          <Avatar user={@props.user} />
          <Link to="inbox" params={name: @props.user.login} className="message-link"><i className="fa fa-envelope#{if @state.unread then '' else '-o'}" /> </Link>
        </div>
        <div aria-hidden={!@state.expanded} aria-label="account menu" className="account-menu" ref="accountMenu">
          <Link to="user-profile" params={name: @props.user.login}><Translate content="accountMenu.profile" /></Link>
          <Link to="settings" params={name: @props.user.login}><Translate content="accountMenu.settings" /></Link>
          <Link to="collections-user" params={{owner: @props.user.login}}>
            <Translate content="accountMenu.collections" />
          </Link>
          <button className="secret-button sign-out-button" type="button" onClick={@handleSignOutClick}><Translate content="accountMenu.signOut" /></button>
        </div>
      </div>

  handleSignOutClick: ->
    auth.signOut()

  toggleAccountMenu: ->
    @setState expanded: !@state.expanded

  navigateMenu: (e) ->
    return unless @state.expanded
    focusables = [@getDOMNode().querySelector 'button']
    focusables.push control for control in @getDOMNode().querySelectorAll '.account-menu button, .account-menu a[href]'
    focus_index = i for control, i in focusables when control == document.activeElement
    switch e.which
      when UP
        new_index = Math.max 0, focus_index - 1
        focusables[new_index].focus()
        e.preventDefault()
      when DOWN
        new_index = Math.min focusables.length - 1, focus_index + 1
        focusables[new_index].focus()
        e.preventDefault()
