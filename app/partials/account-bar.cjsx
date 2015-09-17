React = require 'react'
{Link} = require 'react-router'
auth = require '../api/auth'
talkClient = require '../api/talk'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
Avatar = require '../partials/avatar'
TriggeredModalForm = require 'modal-form/triggered'

UP = 38
DOWN = 40

counterpart.registerTranslations 'en',
  accountMenu:
    profile: 'Profile'
    settings: 'Settings'
    signOut: 'Sign Out'
    collections: 'Collections'
    favorites: 'Favorites'

module.exports = React.createClass
  displayName: 'AccountBar'

  propTypes:
    user: React.PropTypes.object.isRequired

  getDefaultProps: ->
    focusablesSelector: 'a[href], button'

  getInitialState: ->
    unread: false

  componentDidMount: ->
    window.addEventListener 'locationchange', @setUnread
    @setUnread()

  componentWillUnmount: ->
    window.removeEventListener 'locationchange', @setUnread

  setUnread: ->
    talkClient.type('conversations').get({user_id: @props.user.id, unread: true, page_size: 1})
      .then (conversations) =>
        @setState {unread: !!conversations.length}
      .catch (e) -> console.log "e unread messages", e

  render: ->
      <div className="account-bar">
        <div className="account-info">
          <TriggeredModalForm ref="accountMenuButton" className="account-menu" trigger={
            <span>
              <strong>{@props.user.display_name}</strong>{' '}
              <Avatar user={@props.user} />
            </span>
          } triggerProps={
            className: 'secret-button',
            onClick: @handleAccountMenuOpen
          }>
            <div ref="accountMenu" role="menu" className="secret-list" onKeyDown={@navigateMenu}>
              <Link role="menuitem" to="user-profile" params={name: @props.user.login}>
                <i className="fa fa-user fa-fw"></i>{' '}
                <Translate content="accountMenu.profile" />
              </Link>
              <Link role="menuitem" to="settings" params={name: @props.user.login}>
                <i className="fa fa-cogs fa-fw"></i>{' '}
                <Translate content="accountMenu.settings" />
              </Link>
              <Link role="menuitem" to="collections-user" params={{owner: @props.user.login}}>
                <i className="fa fa-image fa-fw"></i>{' '}
                <Translate content="accountMenu.collections" />
              </Link>
              <Link role="menuitem" to="favorites-user" params={{owner: @props.user.login}}>
                <i className="fa fa-star fa-fw"></i>{' '}
                <Translate content="accountMenu.favorites" />
              </Link>
              <hr />
              <button role="menuitem" type="button" className="secret-button sign-out-button" onClick={@handleSignOutClick}>
                <i className="fa fa-sign-out fa-fw"></i>{' '}
                <Translate content="accountMenu.signOut" />
              </button>
            </div>
          </TriggeredModalForm>{' '}

          <Link to="inbox" params={name: @props.user.login} className="message-link" aria-label="Inbox #{if @state.unread then 'with unread messages' else ''}">
            <i className="fa fa-envelope#{if @state.unread then ' unread' else '-o'}" />
          </Link>
        </div>
      </div>

  handleAccountMenuOpen: ->
    setTimeout => # Wait for the state change to take place.
      if @refs.accountMenuButton.state.open
        # React's `autoFocus` apparently doesn't work on <a> tags.
        @refs.accountMenu.getDOMNode().querySelector(@props.focusablesSelector)?.focus()

  navigateMenu: (e) ->
    focusables = @refs.accountMenu.getDOMNode().querySelectorAll @props.focusablesSelector

    for control, i in focusables when control is document.activeElement
      focusIndex = i

    switch e.which
      when UP
        newIndex = Math.max 0, focusIndex - 1
        focusables[newIndex]?.focus()
        e.preventDefault()
      when DOWN
        newIndex = Math.min focusables.length - 1, focusIndex + 1
        focusables[newIndex]?.focus()
        e.preventDefault()

  handleSignOutClick: ->
    auth.signOut()
