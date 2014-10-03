# @cjsx React.DOM

React = require 'react'
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

NotificationViewer = require './components/notification-viewer'

Main = React.createClass
  displayName: 'Main'

  getInitialState: ->
    currentLogin: loginStore.current
    loggingIn: loginStore.loading

  componentWillMount: ->
    loginStore.listen @handleLoginChange

  componentWillUnmount: ->
    loginStore.stopListening @handleLoginChange

  handleLoginChange: ->
    @setState
      currentLogin: loginStore.current
      loggingIn: loginStore.loading

  render: ->
    <div className="panoptes-main">
      <MainHeader currentLogin={@state.currentLogin} loggingIn={@state.loggingIn} />

      <div className="main-content">
        <Route path="/" handler={Home} />
        <Route path="/sign-in(/:form)" handler={SignIn} currentLogin={@state.currentLogin} loggingIn={@state.loggingIn} />
        <Route path="/projects(/:categories)" handler={Projects} />
        <Route path="/projects/:owner/:name(/:section)" handler={Project} />
        <Route path="/settings(/:section)" login={@state.currentLogin} loading={@state.loggingIn} handler={Settings} />
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

login = require './data/login'
login.check()

# For React DevTools Chrome plugin:
unless process.env.NODE_ENV is 'production'
  window.React = React
