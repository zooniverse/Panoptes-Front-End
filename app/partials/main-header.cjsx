counterpart = require 'counterpart'
React = require 'react'
{Link} = require 'react-router'
ZooniverseLogo = require './zooniverse-logo'
Translate = require 'react-translate-component'
LoadingIndicator = require '../components/loading-indicator'
AccountBar = require './account-bar'
LoginBar = require './login-bar'
PromiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'

counterpart.registerTranslations 'en',
  mainNav:
    home: 'Home'
    discover: 'Discover'
    learn: 'Learn'
    talk: 'Talk'
    lab: 'The lab'

module.exports = React.createClass
  displayName: 'MainHeader'

  mixins: [PromiseToSetState]

  getInitialState: ->
    user: null

  componentDidMount: ->
    @handleAuthChange()
    auth.listen @handleAuthChange
    @addEventListeners()

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange
    @removeEventListeners()

  addEventListeners: ->
    if @checkIfOnHome() then document.addEventListener 'scroll', @onScroll
    window.addEventListener 'hashchange', @onHashChange

  removeEventListeners: ->
    document.removeEventListener 'scroll', @onScroll
    window.removeEventListener 'hashchange', @onHashChange

  onHashChange: ->
    if @checkIfOnHome()
      document.addEventListener 'scroll', @onScroll
    else
     document.removeEventListener 'scroll', @onScroll
     React.findDOMNode(@refs.mainTitle).classList.remove 'header-sticky'

  checkIfOnHome: ->
    return true if window.location.hash is '#/'

  handleAuthChange: ->
    @promiseToSetState user: auth.checkCurrent()

  render: ->
    <header className="main-header">
      <div className="main-title" ref="mainTitle">
        <Link to="home" className="main-logo">
          <ZooniverseLogo />
        </Link>
        <nav className="main-nav">
          <Link to="projects" className="main-nav-item"><Translate content="mainNav.discover" /></Link>
          <Link to="about" className="main-nav-item"><Translate content="mainNav.learn" /></Link>
          {unless process.env.NODE_ENV is 'production'
            <Link to="talk" className="main-nav-item"><Translate content="mainNav.talk" /></Link>}
          <hr />
          {if @state.user?
            <Link to="lab" className="main-nav-item"><Translate className="minor" content="mainNav.lab" /></Link>}
        </nav>
        {if @state.user?
          <AccountBar user={@state.user} />
        else
          <LoginBar />}
      </div>

      <div className="main-header-group"></div>
    </header>

  onScroll: ->
    mainTitle = React.findDOMNode(@refs.mainTitle)

    if window.scrollY >= 200
      mainTitle.classList.add 'header-sticky'

    if window.scrollY is 0
      mainTitle.classList.remove 'header-sticky'
