counterpart = require 'counterpart'
React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
PromiseRenderer = require '../../components/promise-renderer'
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

  getDefaultProps: ->
    user: null

  getInitialState: ->
    profileHeader: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'
    @getProfileHeader(@props.user)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.user is @props.user
      @getProfileHeader(nextProps.user)

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  getProfileHeader: (user) ->
    # TODO: Why's this return an array?
    # The user should have an ID in its links.
    @props.user.get('profile_header')
      .catch =>
        []
      .then ([profileHeader]) =>
        @setState({profileHeader})

  render: ->
    if @state.profileHeader?
      headerStyle = backgroundImage: "url(#{@state.profileHeader.src})"

    <div className="secondary-page user-profile">
      <section className="hero user-profile-hero" style={headerStyle}>
        <div className="overlay"></div>
        <div className="hero-container">
          <h1>{@props.user.display_name}</h1>
          <nav className="hero-nav">
            <Link to="collections-user" params={owner: @props.user.login}>
              <Translate content="profile.nav.collections" />
            </Link>
          </nav>
        </div>
      </section>

      <section className="user-profile-content">
        <RouteHandler {...@props} />
      </section>
    </div>

module.exports = React.createClass
  displayName: 'UserProfilePageWrapper'

  render: ->
    <PromiseRenderer promise={apiClient.type('users').get({login: @props.params.name})} then={([user]) =>
      if user?
        <UserProfilePage user={user} />
      else
        <p>Sorry, we couldn’t find any user going by <strong>{@props.params.name}</strong>.</p>
    } />
