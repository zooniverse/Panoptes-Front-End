counterpart = require 'counterpart'
React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
Avatar = require '../../partials/avatar'
classNames = require 'classnames'
TitleMixin = require '../../lib/title-mixin'

counterpart.registerTranslations 'en',
  profile:
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

  mixins: [TitleMixin]

  title: ->
    "Users » #{@props.profileUser.display_name}"

  getDefaultProps: ->
    profileUser: null

  getInitialState: ->
    profileHeader: null

  contextTypes:
    geordi: React.PropTypes.object

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'
    @getProfileHeader(@props.profileUser)

  componentWillReceiveProps: (nextProps) ->
    document.documentElement.classList.add 'on-secondary-page'
    unless nextProps.profileUser is @props.profileUser
      @getProfileHeader(nextProps.profileUser)

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  logClick: ->
    @context?.geordi?.logEvent
      type: 'message-user'
      data: {sender: @props.user.display_name, recipient: @props.profileUser.display_name}

  getProfileHeader: (user) ->
    # TODO: Why's this return an array?
    # The user should have an ID in its links.
    @props.profileUser.get('profile_header')
      .catch =>
        []
      .then ([profileHeader]) =>
        @setState({profileHeader})

  renderNavLinks: ->
    baseLink = if @props.project? then "/projects/#{@props.project.slug}/" else "/"
    classes = classNames {
      "about-tabs": @props.project?
    }
    <span>
      <IndexLink to="#{baseLink}users/#{@props.profileUser.login}" className={classes} activeClassName="active" onClick={logClick?.bind(this, 'comments')}>
         <Translate content="profile.nav.comments" />
      </IndexLink>
      {' '}
      <Link to="#{baseLink}users/#{@props.profileUser.login}/collections" className={classes} activeClassName="active" onClick={logClick?.bind(this, 'collections')}>
        <Translate content="profile.nav.collections" />
      </Link>
      {' '}
      <Link to="#{baseLink}users/#{@props.profileUser.login}/favorites" className={classes} activeClassName="active" onClick={logClick?.bind(this, 'favorites')}>
        <Translate content="profile.nav.favorites" />
      </Link>
      {' '}

      <span>
        {if @props.user is @props.profileUser
          <Link to="#{baseLink}users/#{@props.profileUser.login}/stats" className={classes} activeClassName="active" onClick={logClick?.bind(this, 'stats')}>
            <Translate content="profile.nav.stats" />
          </Link>
        else
          <Link to="#{baseLink}users/#{@props.profileUser.login}/message" className={classes} activeClassName="active"onClick={@logClick.bind null, this}>
            <Translate content="profile.nav.message" />
          </Link>}
      </span>
    </span>

  render: ->
    logClick = @context?.geordi?.makeHandler? 'user-menu'
    if @state.profileHeader?
      headerStyle = backgroundImage: "url(#{@state.profileHeader.src})"
    pageClasses = classNames {
      "secondary-page": true
      "all-resources-page": true
      "user-profile": true
      "has-project-context": @props.project?
    }
    containerClasses = classNames {
      "user-profile-content": true
      "project-text-content": @props.project?
      "in-project-context": @props.project?
    }
    <div className={pageClasses}>
      <section className="hero user-profile-hero" style={headerStyle}>
        <div className="overlay"></div>
        <div className="hero-container">
          <h1><Avatar user={@props.profileUser} />{@props.profileUser.display_name}<span className="login-name">({@props.profileUser.login})</span></h1>
          {if !@props.project?
            <nav className="hero-nav">
              {@renderNavLinks()}
            </nav>}
        </div>
      </section>

      <section className={containerClasses}>
        {if @props.project?
          <nav className="hero-nav">
            {@renderNavLinks()}
          </nav>}
        {React.cloneElement(@props.children, @props)}
      </section>
    </div>

module.exports = React.createClass
  displayName: 'UserProfilePageWrapper'

  render: ->
    <PromiseRenderer promise={apiClient.type('users').get({login: @props.params.profile_name})} then={([profileUser]) =>
      if profileUser?
        <UserProfilePage {...@props} profileUser={profileUser} user={@props.user} />
      else
        <p>Sorry, we couldn’t find any user going by <strong>{@props.params.profile_name}</strong>.</p>
    } />
