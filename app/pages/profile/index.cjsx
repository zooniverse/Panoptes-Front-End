counterpart = require 'counterpart'
React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
Translate = require 'react-translate-component'
{Link, RouteHandler} = require 'react-router'
talkClient = require '../../api/talk'

counterpart.registerTranslations 'en',
  profile:
    title: "Hi, %(name)s!"
    nav:
      comments: "Recent comments"
      stats: "Stats"
      collections: "Collections"
      favorites: "Favorites"
      message: "Message"
      moderation: "Moderation"
      stats: "Your stats"
      settings: "Settings"

UserProfilePage = React.createClass
  displayName: 'UserProfilePage'

  getDefaultProps: ->
    profileUser: null

  getInitialState: ->
    profileHeader: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'
    @getProfileHeader(@props.profileUser)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.profileUser is @props.profileUser
      @getProfileHeader(nextProps.profileUser)

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  getProfileHeader: (user) ->
    # TODO: Why's this return an array?
    # The user should have an ID in its links.
    @props.profileUser.get('profile_header')
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
          <h1>{@props.profileUser.display_name}</h1>
          <nav className="hero-nav">
            <Link to="user-profile" params={name: @props.profileUser.login}>
              <Translate content="profile.nav.comments" />
            </Link>
            {' '}
            <Link to="collections-user" params={owner: @props.profileUser.login}>
              <Translate content="profile.nav.collections" />
            </Link>
            {' '}
            <Link to="favorites-user" params={owner: @props.profileUser.login}>
              <Translate content="profile.nav.favorites" />
            </Link>
            {' '}

            <span>
              {if @props.user is @props.profileUser
                <Link to="user-profile-stats" params={name: @props.profileUser.login}>
                  <Translate content="profile.nav.stats" />
                </Link>
              else
                <Link to="user-profile-private-message" params={name: @props.profileUser.login}>
                  <Translate content="profile.nav.message" />
                </Link>}

            </span>
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
    <PromiseRenderer promise={apiClient.type('users').get({login: @props.params.name})} then={([profileUser]) =>
      if profileUser?
        <UserProfilePage profileUser={profileUser} user={@props.user} />
      else
        <p>Sorry, we couldn’t find any user going by <strong>{@props.params.name}</strong>.</p>
    } />
