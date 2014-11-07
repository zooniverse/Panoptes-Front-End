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
CreateProject = require './pages/create-project'

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
      <MainHeader />

      <div className="main-content">
        <Route path="/" handler={Home} />
        <Route path="/sign-in(/:form)" handler={SignIn} currentLogin={@state.currentLogin} loggingIn={@state.loggingIn} />
        <Route path="/projects(/:categories)" handler={Projects} />
        <Route path="/projects/:owner/:name(/:section)" handler={Project} />
        <Route path="/settings(/:section)" handler={Settings} />
        <Route path="/users/:login(/:section)" handler={UserProfile} />
        <Route path="/build" handler={Build} />
        <Route path="/new-project(/*etc)" handler={CreateProject} />
      </div>

      <MainFooter />

      <NotificationViewer event="notify" />
    </div>

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

React.renderComponent Main(null), mainContainer
