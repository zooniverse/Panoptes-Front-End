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

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

    @getUser()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.params.name isnt @props.params.name
      @getUser()

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  getUser: ->
    authClient.checkCurrent()
      .then (currentUser) =>
        if currentUser? and currentUser.display_name is @props.params.name
          @getProfileHeader(currentUser)
        else
          apiClient.type('users').get(login: @props.params.name)
            .then ([fetchedUser]) =>
              @getProfileHeader(fetchedUser)

  getProfileHeader: (user) ->
    profileHero = React.findDOMNode(@refs.userProfileHero)

    user.get('profile_header')
      .then ([profile_header]) ->
        profileHero.style.backgroundImage = "url(#{profile_header.src})"
      .catch ->
        profileHero.style.backgroundImage = ''
        profileHero.style.backgroundColor = "#0072ff"

  render: ->
    <div className="secondary-page user-profile">
      <section className="hero user-profile-hero" ref="userProfileHero">
        <div className="overlay"></div>
        <div className="hero-container">
          <PromiseRenderer promise={authClient.checkCurrent()} pending={null}>{(currentUser) =>
            if currentUser? and currentUser.display_name is @props.params.name
              <Translate name={currentUser.display_name} content="profile.title" component="h1" />
            else
              <PromiseRenderer
                promise={apiClient.type('users').get(login: @props.params?.name)}
                pending={null}
                then={([fetchedUser]) =>
                  <h1>{fetchedUser.display_name}</h1>}
              />
          }</PromiseRenderer>
          <nav className="hero-nav">
            <Link to="collections-user" params={owner: @props.params.name}><Translate content="profile.nav.collections" /></Link>
            <PromiseRenderer promise={authClient.checkCurrent()} pending={null}>{(currentUser) =>
              if currentUser?
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
