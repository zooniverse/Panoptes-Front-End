React = window.React = require 'react'
{dispatch} = require './lib/dispatcher'
appState = require './data/app-state'
currentUser = require './data/current-user'
MainHeader = require './partials/main-header'
ChildRouter = require 'react-child-router'
MainFooter = require './partials/main-footer'
LoginDialog = require './partials/login-dialog'

Home = require './pages/home'
SignIn = require './pages/sign-in'
Projects = require './pages/projects'
Project = require './pages/project'
Settings = require './pages/settings'
UserProfile = require './pages/user-profile'
Build = require './pages/build'

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
        React.DOM.div hash: '#/settings/*',
        Settings user: @state.user
        UserProfile hash: '#/users/:login/*'
        Build hash: '#/build/*'

      MainFooter null

      if @state.showingLoginDialog
        LoginDialog user: @state.user

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

React.renderComponent Main(null), mainContainer

dispatch 'current-user:check'
