# @cjsx React.DOM

React = window.React = require 'react'
loginStore = require './data/login'
MainHeader = require './partials/main-header'
ChildRouter = require 'react-child-router'
Route = require './lib/route'
MainFooter = require './partials/main-footer'

Home = require './pages/home'
SignIn = require './pages/sign-in'
Projects = require './pages/projects'
Project = require './pages/project'
Settings = require './pages/settings'
UserProfile = require './pages/user-profile'
Build = require './pages/build'

DemoRouteHandler = React.createClass
  render: ->
    <ul>
      <li>Params: <code>{JSON.stringify @props.route.params}</code></li>
      <li>Query: <code>{JSON.stringify @props.route.query}</code></li>
      <li>Hash: <code>{JSON.stringify @props.route.hash}</code></li>
    </ul>

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
      </div>

      <MainFooter />
    </div>

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

React.renderComponent Main(null), mainContainer

login = require './data/login'
login.check()
