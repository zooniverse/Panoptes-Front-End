if process.env.NODE_ENV is 'offline'
  console?.warn 'NODE_ENV is', process.env.NODE_ENV

React = window.React = require 'react'
appState = require './data/app-state'
currentUser = require './data/current-user'
MainHeader = require './partials/main-header'
ChildRouter = require 'react-child-router'
MainFooter = require './partials/main-footer'
LoginDialog = require './partials/login-dialog'
currentUserActions = require './actions/current-user'

Home = require './pages/home'
SignIn = require './pages/sign-in'
Projects = require './pages/projects'
Project = require './pages/project'
EditAccount = require './pages/edit-account'

Main = React.createClass
  displayName: 'Main'
  mixins: [appState.mixInto {'showLoginDialog'}]

  getInitialState: ->
    user: currentUser.current
    showLoginDialog: appState.showLoginDialog

  componentDidMount: ->
    currentUser.on 'change', this, 'handleUserChange'

  componentWillUnmount: ->
    currentUser.off 'change', this, 'handleUserChange'

  handleUserChange: ->
    @setState user: currentUser.current

  render: ->
    React.DOM.div className: 'panoptes-main',
      MainHeader user: @state.user

      ChildRouter className: 'main-content',
        Home hash: '#'
        SignIn hash: '#/sign-in/*'
        Projects hash: '#/projects'
        Project hash: '#/projects/:name/*'
        React.DOM.div hash: '#/edit/account/*',
          if @state.user?
            EditAccount user: @state.user
          else
            React.DOM.p className: 'content-container',
              React.DOM.a href: '#/sign-in', 'Looks like you need to sign in.'

      MainFooter null

      if @state.showLoginDialog
        LoginDialog null
      else
        React.DOM.noscript null

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

React.renderComponent Main(null), mainContainer

currentUserActions.check()
