counterpart = require 'counterpart'
React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
ContextualLinks = require '../../lib/contextual-links'

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
      removeProjectContextLink: 'View\u00a0%(collectionOwnerName)s\'s\u00a0Zooniverse.org\u00a0Profile'

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

  getPageClasses: ->
    classes = 'secondary-page user-profile'
    if @props.project?
      classes += ' has-project-context'
    classes

  getLinksForNav: ->
    return {
      recents: ContextualLinks.prefixLinkIfNeeded @props, "/users/#{@props.profileUser.login}"
      collections: ContextualLinks.prefixLinkIfNeeded @props, "/collections/#{@props.profileUser.login}"
      favorites:  ContextualLinks.prefixLinkIfNeeded @props, "/favorites/#{@props.profileUser.login}"
      stats: ContextualLinks.prefixLinkIfNeeded @props, "/users/#{@props.profileUser.login}/stats"
      message: ContextualLinks.prefixLinkIfNeeded @props, "/users/#{@props.profileUser.login}/message"
      removeProjectContextLink: ContextualLinks.getRemoveProjectContextLink @props
    }

  renderNavLinks: ->
    linksForNav = @getLinksForNav()
    className = ""
    if @props.project?
      className += " about-tabs"
    <span>
      <IndexLink to="#{linksForNav.recents}" className={className} activeClassName="active">
        <Translate content="profile.nav.comments" />
      </IndexLink>
      <Link to="#{linksForNav.collections}" className={className} activeClassName="active">
        <Translate content="profile.nav.collections" />
      </Link>
      <Link to="#{linksForNav.favorites}" className={className} activeClassName="active">
        <Translate content="profile.nav.favorites" />
      </Link>
      {if @props.user is @props.profileUser
        <Link to="#{linksForNav.stats}" className={className} activeClassName="active">
          <Translate content="profile.nav.stats" />
        </Link>
      else
        <Link to="#{linksForNav.message}" className={className} activeClassName="active">
          <Translate content="profile.nav.message" />
        </Link>}
      {if @props.project?
        <Link to="#{linksForNav.removeProjectContextLink.to}" className={className} activeClassName="active">
          <Translate content="profile.nav.removeProjectContextLink" collectionOwnerName={linksForNav.removeProjectContextLink.message.user?.displayName} />
        </Link>}
    </span>

  render: ->

    if @state.profileHeader?
      headerStyle = backgroundImage: "url(#{@state.profileHeader.src})"

    classNames = "user-profile-content"
    if @props.project?
      classNames += " project-text-content in-project-context talk"

    <div className="#{@getPageClasses()}">
      <section className="hero user-profile-hero" style={headerStyle}>
        <div className="overlay"></div>
        <div className="hero-container">
          <h1>{@props.profileUser.display_name}</h1>
          {if !@props.project?
            <nav className="hero-nav">
              {@renderNavLinks()}
            </nav>}
        </div>
      </section>

      <section className={classNames}>
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
    <PromiseRenderer promise={apiClient.type('users').get({login: @props.params.name})} then={([profileUser]) =>
      if profileUser?
        <UserProfilePage {...@props} profileUser={profileUser} user={@props.user} />
      else
        <p>Sorry, we couldn’t find any user going by <strong>{@props.params.name}</strong>.</p>
    } />
