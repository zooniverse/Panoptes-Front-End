counterpart = require 'counterpart'
React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
PromiseRenderer = require '../../components/promise-renderer'
authClient = require '../../api/auth'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

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

  getInitialState: ->
    user: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

    apiClient.type('users').get(slug: @props.params.name)
      .then (user) =>
        @setState user: user[0]

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="secondary-page user-profile">
      <section className="hero user-profile-hero">
        <div className="hero-container">
          <PromiseRenderer promise={authClient.checkCurrent()} pending={null}>{(user) =>
            if user?
              <Translate name={user.display_name} content="profile.title" component="h1" />
            else
              <h1>{@state.user.display_name}</h1>
          }</PromiseRenderer>
          <nav className="hero-nav">
            <Link to="user-profile-feed" params={name: @props.params.name}><Translate content="profile.nav.feed" /></Link>
            <Link to="user-profile-stats" params={name: @props.params.name}><Translate content="profile.nav.stats" /></Link>
            <Link to="user-profile-favorites" params={name: @props.params.name}><Translate content="profile.nav.favorites" /></Link>
            <PromiseRenderer promise={authClient.checkCurrent()}>{(user) =>
              if user?
                <span>
                  <Link to="inbox"><Translate content="profile.nav.messages" /></Link>
                  <Link to="settings-home" params={name: @props.params.name}><Translate content="profile.nav.settings" /></Link>
                </span>
            }</PromiseRenderer>
          </nav>
        </div>
      </section>
      <section>
        User profile feed
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
      <UserProfilePage params={@props.params} />
    }/>
