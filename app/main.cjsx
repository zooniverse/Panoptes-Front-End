React = require 'react'
window.React = React
Router = {RouteHandler, DefaultRoute, Route, NotFoundRoute} = require 'react-router'
MainHeader = require './partials/main-header'
MainFooter = require './partials/main-footer'

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

  <Route path="account" handler={require './pages/sign-in'}>
    <Route name="sign-in" handler={require './partials/sign-in-form'} />
    <Route name="register" handler={require './partials/register-form'} />
  </Route>
  <Route name="settings" handler={require './pages/settings'} />
  <Route name="privacy" handler={require './pages/privacy-policy'} />

  <Route name="user-profile" path="users/:name" handler={require './pages/user-profile'} />

  <Route name="projects" handler={require './pages/projects'} />
  <Route name="project" path="projects/:id" handler={require './pages/project'}>
    <DefaultRoute name="project-home" handler={require './pages/project/home'} />
    <Route name="project-science-case" path="science-case" handler={require './pages/project/science-case'} />
    <Route name="project-status" path="status" handler={require './pages/project/status'} />
    <Route name="project-team" path="team" handler={require './pages/project/team'} />
    <Route name="project-classify" path="classify" handler={require './pages/project/classify'} />
    <Route name="project-talk" path="talk" handler={require './pages/project/talk'} />
  </Route>

  <Route name="build" handler={require './pages/build'} />
  <Route name="new-project" path="build/new-project" handler={require './pages/new-project'}>
    <DefaultRoute name="new-project-general" handler={require './pages/new-project/general'} />
    <Route name="new-project-science-case" path="science-case" handler={require './pages/new-project/science-case'} />
    <Route name="new-project-subjects" path="subjects" handler={require './pages/new-project/subjects'} />
    <Route name="new-project-workflow" path="workflow" handler={require './pages/new-project/workflow'} />
    <Route name="new-project-review" path="review" handler={require './pages/new-project/review'} />
  </Route>
  <Route name="edit-project" path="edit-project/:id" handler={require './pages/edit-project'} />

  <Route path="todo/?*" handler={React.createClass render: -> <div className="content-container"><i className="fa fa-cogs"></i> TODO</div>} />
  <NotFoundRoute handler={React.createClass render: -> <div className="content-container"><i className="fa fa-frown-o"></i> Not found</div>} />
</Route>

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

Router.run routes, (Handler, {params}) ->
  React.render(<Handler params={params} />, mainContainer);
