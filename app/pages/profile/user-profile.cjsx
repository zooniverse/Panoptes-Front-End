counterpart = require 'counterpart'
React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
PromiseRenderer = require '../../components/promise-renderer'
authClient = require '../../api/auth'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
ToggleChildren = require '../../talk/mixins/toggle-children'
Feed = require './feed'
Stats = require './stats'
Favorites = require './favorites'

counterpart.registerTranslations 'en',
  profile:
    title: "Hi, %(name)s!"
    nav:
      feed: "Feed"
      stats: "Stats"
      favorites: "Favorites"
      messages: "Messages"
      settings: "Settings"

UserProfilePage = React.createClass
  displayName: 'UserProfilePage'
  mixins: [ToggleChildren]

  getInitialState: ->
    user: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

    apiClient.type('users').get(slug: @props.params.name)
      .then (user) =>
        @setState user: user[0]

    apiClient.type('users').get(slug: @props.params.name).get('profile_header')
      .then (header) =>
        console.log 'header', header
      .catch (error) =>
        console.error 'error', error

    @toggleComponent @props.routes[@props.routes.length - 1].name

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  onClickLink: (routeName) ->
    @toggleComponent routeName

  render: ->
    <div className="secondary-page user-profile">
      <section className="hero user-profile-hero">
        <div className="hero-container" ref="heroContainer">
          <PromiseRenderer promise={authClient.checkCurrent()} pending={null}>{(user) =>
            if user?
              <Translate name={user.display_name} content="profile.title" component="h1" />
            else
              <h1>{@state.user.display_name}</h1>
          }</PromiseRenderer>
          <nav className="hero-nav">
            <Link to="user-profile-feed" params={name: @props.params.name} onClick={@onClickLink.bind(null, 'user-profile-feed')}><Translate content="profile.nav.feed" /></Link>
            <Link to="user-profile-stats" params={name: @props.params.name} onClick={@onClickLink.bind(null, 'user-profile-stats')}><Translate content="profile.nav.stats" /></Link>
            <Link to="user-profile-favorites" params={name: @props.params.name} onClick={@onClickLink.bind(null, 'user-profile-favorites')}><Translate content="profile.nav.favorites" /></Link>
            <PromiseRenderer promise={authClient.checkCurrent()} pending={null}>{(user) =>
              if user?
                <span>
                  <Link to="inbox"><Translate content="profile.nav.messages" /></Link>
                  <Link to="settings"><Translate content="profile.nav.settings" /></Link>
                </span>
            }</PromiseRenderer>
          </nav>
        </div>
      </section>
      <section>
        {switch @state.showing
          when 'user-profile-feed'
            <Feed />
          when 'user-profile-stats'
            <Stats />
          when 'user-profile-favorites'
            <Favorites />
        }
        <PromiseRenderer promise={authClient.checkCurrent()} pending={null}>{(user) =>
          if user?.display_name isnt @props.params?.name
            <PrivateMessageForm {...@props} />
        }</PromiseRenderer>
      </section>
    </div>

module.exports = React.createClass
  displayName: 'UserProfilePageWrapper'

  render: ->
    <ChangeListener target={authClient} handler={=>
      <UserProfilePage params={@props.params} routes={@props.routes} />
    }/>
