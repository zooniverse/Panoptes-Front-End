counterpart = require 'counterpart'
React = require 'react'
{IndexLink, Link, History} = require 'react-router'
ZooniverseLogo = require './zooniverse-logo'
Translate = require 'react-translate-component'
LoadingIndicator = require '../components/loading-indicator'
AccountBar = require './account-bar'
LoginBar = require './login-bar'
PromiseToSetState = require '../lib/promise-to-set-state'
auth = require 'panoptes-client/lib/auth'
isAdmin = require '../lib/is-admin'
TriggeredModalForm = require 'modal-form/triggered'
debounce = require 'debounce'
HamburgerIcon = require '../partials/hamburger-icon'
PassHistoryContext = require '../components/pass-history-context'

counterpart.registerTranslations 'en',
  mainNav:
    home: 'Home'
    projects: 'Projects'
    about: 'About'
    collect: 'Collect'
    talk: 'Talk'
    daily: 'Daily Zooniverse'
    blog: 'Blog'
    lab: 'Build a project'
    admin: 'Admin'
    notifications: 'Notifications'

MOBILE_WIDTH = 875 # px

module.exports = React.createClass
  displayName: 'MainHeader'

  mixins: [History]

  getDefaultProps: ->
    user: null

  getInitialState: ->
    mobile: @isMobile()

  componentDidMount: ->
    if @checkIfOnHome() then document.addEventListener 'scroll', @onScroll
    window.addEventListener 'locationchange', @onLocationChange
    window.addEventListener 'resize', debounce(@onResize, 100)

  componentWillUnmount: ->
    document.removeEventListener 'scroll', @onScroll
    window.removeEventListener 'resize', debounce(@onResize, 100)

  isMobile: ->
    window?.innerWidth < MOBILE_WIDTH ? false

  onResize: ->
    @setState mobile: @isMobile()

  onLocationChange: ->
    if @checkIfOnHome()
      document.addEventListener 'scroll', @onScroll
    else
     document.removeEventListener 'scroll', @onScroll
     @refs.mainTitle.classList.remove 'header-sticky'

  checkIfOnHome: ->
    window.location is '/'

  mobileClass: ->
    if @state.mobile then 'mobile' else ''

  links: ->
    <nav className="main-nav #{@mobileClass()}">
      <Link to={"/projects"} className="main-nav-item" activeClassName="active"><Translate content="mainNav.projects" /></Link>
      <Link to={"/about"} className="main-nav-item" activeClassName="active"><Translate content="mainNav.about" /></Link>
      <Link to={"/talk"} className="main-nav-item" activeClassName="active"><Translate content="mainNav.talk" /></Link>
      <Link to={"/notifications"} className="main-nav-item" activeClassName="active"><Translate content="mainNav.notifications" /></Link>
      <Link to={"/collections"} className="main-nav-item" activeClassName="active"><Translate content="mainNav.collect" /></Link>
      <hr />
      <Link to={"/lab"} activeClassName="active" className="main-nav-item nav-build"><Translate className="minor" content="mainNav.lab" /></Link>
      {if isAdmin()
        <Link to={"/admin"} className="main-nav-item nav-build" activeClassName="active"><Translate className="minor" content="mainNav.admin" /></Link>}
    </nav>

  render: ->
    {mobile} = @state

    <header className="main-header #{@mobileClass()}">
      <div className="main-title" ref="mainTitle">
        <IndexLink to="/" className="main-logo">
          <ZooniverseLogo />
        </IndexLink>

        {if not mobile
          <span>{@links()}</span>}

        {if @props.user?
          <AccountBar user={@props.user} />
        else
          <LoginBar />}


        {if mobile
          <TriggeredModalForm
            triggerProps={className: "hamburger-modal-trigger"}
            trigger={<HamburgerIcon />}>
            <PassHistoryContext {...@props} context={history: @history}>
              {@links()}
            </PassHistoryContext>
          </TriggeredModalForm>}

      </div>

      <div className="main-header-group"></div>
    </header>

  onScroll: ->
    mainTitle = @refs.mainTitle

    if window.scrollY >= 1
      mainTitle.classList.add 'header-sticky'

    if window.scrollY is 0
      mainTitle.classList.remove 'header-sticky'
