if process.env.NODE_ENV is 'offline'
  console?.warn 'NODE_ENV is', process.env.NODE_ENV

React = window.React = require 'react'
appState = require './data/app-state'
appActions = require './actions/app'
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
UserProfile = require './pages/user-profile'

Main = React.createClass
  displayName: 'Main'
  mixins: [
    appState.mixInto {'showingLoginDialog'}
    currentUser.mixInto current: 'user'
  ]

  render: ->
    React.DOM.div className: 'panoptes-main',
      MainHeader user: @state.user

      ChildRouter className: 'main-content',
        Home hash: '#'
        SignIn hash: '#/sign-in/*'
        Projects hash: '#/projects'
        Projects hash: '#/projects/:categories'
        Project hash: '#/projects/:owner/:name/*'
        React.DOM.div hash: '#/edit/account/*',
          if @state.user?
            EditAccount user: @state.user
          else
            React.DOM.p className: 'content-container',
              React.DOM.button onClick: appActions.showLoginDialog.bind(null, 0), 'Looks like you need to sign in.'
        UserProfile hash: '#/users/:login/*'

      MainFooter null

      if @state.showingLoginDialog
        LoginDialog user: @state.user

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

React.renderComponent Main(null), mainContainer

currentUserActions.check()
