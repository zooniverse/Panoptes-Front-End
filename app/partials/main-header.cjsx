counterpart = require 'counterpart'
React = require 'react'
{Link} = require '@edpaget/react-router'
ZooniverseLogo = require './zooniverse-logo'
Translate = require 'react-translate-component'
LoadingIndicator = require '../components/loading-indicator'
AccountBar = require './account-bar'
LoginBar = require './login-bar'
PromiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'
isAdmin = require '../lib/is-admin'

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

module.exports = React.createClass
  displayName: 'MainHeader'

  getDefaultProps: ->
    user: null

  componentDidMount: ->
    if @checkIfOnHome() then document.addEventListener 'scroll', @onScroll
    window.addEventListener 'locationchange', @onLocationChange

  componentWillUnmount: ->
    document.removeEventListener 'scroll', @onScroll
    window.removeEventListener 'locationchange', @onLocationChange

  onLocationChange: ->
    if @checkIfOnHome()
      document.addEventListener 'scroll', @onScroll
    else
     document.removeEventListener 'scroll', @onScroll
     React.findDOMNode(@refs.mainTitle).classList.remove 'header-sticky'

  checkIfOnHome: ->
    return true if window.location is '/'

  render: ->
    <header className="main-header">
      <div className="main-title" ref="mainTitle">
        <Link to="home" className="main-logo">
          <ZooniverseLogo />
        </Link>
        <nav className="main-nav">
          <Link to="projects" className="main-nav-item"><Translate content="mainNav.projects" /></Link>
          <Link to="about" className="main-nav-item"><Translate content="mainNav.about" /></Link>
          <Link to="talk" className="main-nav-item"><Translate content="mainNav.talk" /></Link>
          <Link to="notifications" className="main-nav-item"><Translate content="mainNav.notifications" /></Link>
          <Link to="collections" className="main-nav-item"><Translate content="mainNav.collect" /></Link>
          <a href="http://daily.zooniverse.org/" className="main-nav-item" target="_blank"><Translate content="mainNav.daily" /></a>
          <a href="http://blog.zooniverse.org/"  className="main-nav-item" target="_blank"><Translate content="mainNav.blog" /></a>
          <hr />
          <Link to="lab" className="main-nav-item nav-build"><Translate className="minor" content="mainNav.lab" /></Link>
          {if isAdmin()
            <Link to="admin" className="main-nav-item nav-build"><Translate className="minor" content="mainNav.admin" /></Link>}
        </nav>
        {if @props.user?
          <AccountBar user={@props.user} />
        else
          <LoginBar />}
      </div>

      <div className="main-header-group"></div>
    </header>

  onScroll: ->
    mainTitle = React.findDOMNode(@refs.mainTitle)

    if window.scrollY >= 1
      mainTitle.classList.add 'header-sticky'

    if window.scrollY is 0
      mainTitle.classList.remove 'header-sticky'
