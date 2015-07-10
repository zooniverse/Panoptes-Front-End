counterpart = require 'counterpart'
React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
auth = require '../../api/auth'
ChangeListener = require '../../components/change-listener'
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
      message: "Message"
      moderation: "Moderation"
      stats: "Your stats"
      settings: "Settings"

userIsModeratorAnywhere = (roles) ->
  roles
    .filter (role) -> ['admin', 'moderator'].indexOf(role.name) isnt -1
    .length > 0

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
            <Link to="user-profile" params={name: @props.user.login}>
              <Translate content="profile.nav.comments" />
            </Link>
            {' '}
            <Link to="collections-user" params={owner: @props.user.login}>
              <Translate content="profile.nav.collections" />
            </Link>
            {' '}
            <ChangeListener target={auth}>{=>
              <PromiseRenderer promise={auth.checkCurrent()}>{(user) =>
                <span>
                  {if user is @props.user
                    <Link to="user-profile-stats" params={name: @props.user.login}>
                      <Translate content="profile.nav.stats" />
                    </Link>
                  else
                    <Link to="user-profile-private-message" params={name: @props.user.login}>
                      <Translate content="profile.nav.message" />
                    </Link>}

                  <PromiseRenderer promise={talkClient.type('roles').get(user_id: @props.user.id)}>{(roles) =>
                    if userIsModeratorAnywhere(roles) and (user is @props.user)
                      <Link to="moderations" params={name: @props.user.login}>
                        <Translate content="profile.nav.moderation" />
                      </Link>
                  }</PromiseRenderer>
                </span>
              }</PromiseRenderer>
            }</ChangeListener>
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
