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
    discuss: 'Discuss'
    lab: 'The lab'

module.exports = React.createClass
  displayName: 'MainHeader'

  mixins: [PromiseToSetState]

  getInitialState: ->
    user: null

  componentDidMount: ->
    @handleAuthChange()
    auth.listen @handleAuthChange

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange

  handleAuthChange: ->
    @promiseToSetState user: auth.checkCurrent()

  render: ->
    <header className="main-header">
      <div className="main-title">
        <Link to="home" className="main-logo">
          <ZooniverseLogo /> Zooniverse
        </Link>
        <nav className="main-nav">
          <Link to="projects" className="main-nav-item"><Translate content="mainNav.discover" /></Link>
          <a className="main-nav-item"><Translate content="mainNav.learn" /></a>
          <Link to="talk" className="main-nav-item"><Translate content="mainNav.discuss" /></Link>
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
