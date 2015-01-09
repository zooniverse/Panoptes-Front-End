React = require 'react'
window.React = React
Router = {RouteHandler, DefaultRoute, Route} = require 'react-router'
MainHeader = require './partials/main-header'
MainFooter = require './partials/main-footer'

SignIn = require './pages/sign-in'
Settings = require './pages/settings'
UserProfile = require './pages/user-profile'
Build = require './pages/build'
CreateProject = require './pages/create-project'
EditProject = require './pages/edit-project'

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

App = React.createClass
  displayName: 'PanoptesApp'

  render: ->
    <div className="panoptes-main">
      <MainHeader />
      <div className="main-content">
        <RouteHandler {...@props} />
      </div>
      <MainFooter />
    </div>

routes = <Route handler={App}>
  <DefaultRoute name="home" handler={require './pages/home'} />
  <Route name="projects" handler={require './pages/projects'} />
  <Route path="projects/:id" handler={require './pages/project'}>
    <DefaultRoute name="project-home" handler={require './pages/project/home'} />
    <Route name="project-science-case" path="science-case" handler={require './pages/project/science-case'} />
    <Route name="project-status" path="status" handler={require './pages/project/status'} />
    <Route name="project-team" path="team" handler={require './pages/project/team'} />
    <Route name="project-classify" path="classify" handler={require './pages/project/classify'} />
    <Route name="project-talk" path="talk" handler={require './pages/project/talk'} />
  </Route>
</Route>

Router.run routes, (Handler, {params}) ->
  React.render(<Handler params={params} />, mainContainer);

# Main = React.createClass
#   displayName: 'Main'

#   getInitialState: ->
#     currentLogin: null
#     loggingIn: false

#   handleLoginChange: ->
#     @setState
#       currentLogin: null
#       loggingIn: false

#   render: ->
#     <div className="panoptes-main">
#       <MainHeader />

#       <div className="main-content">
#         <Route path="/" handler={Home} />
#         <Route path="/sign-in(/:form)" handler={SignIn} currentLogin={@state.currentLogin} loggingIn={@state.loggingIn} />
#         <Route path="/settings(/:section)" handler={Settings} />
#         <Route path="/users/:login(/:section)" handler={UserProfile} />
#         <Route path="/build" handler={Build} />
#         <Route path="/build/new-project(/*section)" handler={CreateProject} />
#         <Route path="/build/edit-project/:projectID" handler={EditProject} />
#       </div>

#       <MainFooter />
#     </div>

# React.render <Main />, mainContainer
