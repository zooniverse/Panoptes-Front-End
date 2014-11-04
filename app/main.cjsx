# @cjsx React.DOM

React = require 'react'
window.React = React
loginStore = require './data/login'
MainHeader = require './partials/main-header'
Route = require './lib/route'
MainFooter = require './partials/main-footer'

Home = require './pages/home'
SignIn = require './pages/sign-in'
Projects = require './pages/projects'
Project = require './pages/project'
Settings = require './pages/settings'
UserProfile = require './pages/user-profile'
Build = require './pages/build'
EditProject = require './pages/edit-project'
{dispatch} = require './lib/dispatcher'

NotificationViewer = require './components/notification-viewer'

Main = React.createClass
  displayName: 'Main'

  getInitialState: ->
    currentUser: loginStore.current
    loggingIn: loginStore.loading
    loginErrors: loginStore.errors

  componentWillMount: ->
    loginStore.listen @handleLoginChange
    dispatch 'current-user:check'

  componentWillUnmount: ->
    loginStore.stopListening @handleLoginChange

  handleLoginChange: ->
    @setState
      currentUser: loginStore.currentUser
      loggingIn: loginStore.loading
      loginErrors: loginStore.errors

  render: ->
    <div className="panoptes-main">
      <MainHeader user={@state.currentUser} />

      <div className="main-content">
        <Route path="/" handler={Home} />
        <Route path="/sign-in(/:form)" handler={SignIn} currentUser={@state.currentUser} loggingIn={@state.loggingIn} errors={@state.loginErrors} />
        <Route path="/projects(/:categories)" handler={Projects} />
        <Route path="/projects/:owner/:name(/:section)" handler={Project} />
        <Route path="/settings(/:section)" login={@state.currentUser} loading={@state.loggingIn} handler={Settings} />
        <Route path="/users/:login(/:section)" handler={UserProfile} />
        <Route path="/build" handler={Build} />
        <Route path="/build/:project_name(/*etc)" handler={EditProject} />
      </div>

      <MainFooter />

      <NotificationViewer event="notify" />
    </div>

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

React.renderComponent Main(null), mainContainer
