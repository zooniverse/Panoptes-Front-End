counterpart = require 'counterpart'
React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
PromiseRenderer = require '../../components/promise-renderer'
authClient = require '../../api/auth'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'
Translate = require 'react-translate-component'
{Link, RouteHandler} = require 'react-router'

counterpart.registerTranslations 'en',
  profile:
    title: "Hi, %(name)s!"
    nav:
      feed: "Feed"
      stats: "Stats"
      collections: "Collections"
      messages: "Messages"
      settings: "Settings"

UserProfilePage = React.createClass
  displayName: 'UserProfilePage'

  getInitialState: ->
    user: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="secondary-page user-profile">
      {#TODO fetch user header background}
      <section className="hero user-profile-hero">
        <div className="hero-container" ref="heroContainer">
          <PromiseRenderer promise={authClient.checkCurrent()} pending={null}>{(user) =>
            if user?
              <Translate name={user.display_name} content="profile.title" component="h1" />
              {#TODO add else statement and promise renderer to get user.display_name}
          }</PromiseRenderer>
          <nav className="hero-nav">
            <Link to="user-profile-feed" params={name: @props.params.name}><Translate content="profile.nav.feed" /></Link>
            <Link to="user-profile-stats" params={name: @props.params.name}><Translate content="profile.nav.stats" /></Link>
            <Link to="collections-user" params={owner: @props.params.name}><Translate content="profile.nav.collections" /></Link>
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
      <section className="user-profile-content">
        <RouteHandler />
        <PromiseRenderer promise={authClient.checkCurrent()} pending={null}>{(user) =>
          if user?.login isnt @props.params?.name
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
