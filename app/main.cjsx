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
  <Route path="projects/:owner/:name" handler={require './pages/project'}>
    <DefaultRoute name="project-home" handler={require './pages/project/home'} />
    <Route name="project-science-case" path="science-case" handler={require './pages/project/science-case'} />
    <Route name="project-results" path="results" handler={require './pages/project/results'} />
    <Route name="project-classify" path="classify" handler={require './pages/project/classify'} />
    <Route name="project-talk" path="talk" handler={require './pages/project/talk'}>
      <DefaultRoute name="project-talk-home" handler={require './talk/home'} />
      <Route name="project-talk-board" path=":board" handler={require './talk/board'} />
      <Route name="project-talk-discussion" path=":board/:discussion" handler={require './talk/discussion'} />
    </Route>
    <Route name="project-faq" path="faq" handler={require './pages/project/faq'} />
    <Route name="project-education" path="education" handler={require './pages/project/education'} />
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
  <Route name="edit-workflow" path="edit-workflow/:id" handler={require './pages/edit-workflow'} />

  <Route name="talk" path="talk" handler={require './talk'}>
    <DefaultRoute name="talk-home" handler={require './talk/home'} />
    <Route name="talk-board" path=":board" handler={require './talk/board'} />
    <Route name="talk-discussion" path=":board/:discussion" handler={require './talk/discussion'} />
  </Route>

  <Route name="lab" handler={require './pages/lab'} />
  <Route path="lab/:projectID" handler={require './pages/lab/project'}>
    <DefaultRoute name="edit-project-details" handler={require './pages/lab/project-details'} />
    <Route name="edit-project-science-case" path="science-case" handler={require './pages/lab/science-case'} />
    <Route name="edit-project-results" path="results" handler={require './pages/lab/results'} />
    <Route name="edit-project-faq" path="faq" handler={require './pages/lab/faq'} />
    <Route name="edit-project-education" path="education" handler={require './pages/lab/education'} />
    <Route name="edit-project-collaborators" path="collaborators" handler={require './pages/lab/collaborators'} />
    <Route name="edit-project-workflow" path="workflow/:workflowID" handler={require './pages/lab/workflow'} />
    <Route name="edit-project-subject-set" path="subject-set/:subjectSetID" handler={require './pages/lab/subject-set'} />
  </Route>

  <Route path="todo/?*" handler={React.createClass render: -> <div className="content-container"><i className="fa fa-cogs"></i> TODO</div>} />
  <NotFoundRoute handler={React.createClass render: -> <div className="content-container"><i className="fa fa-frown-o"></i> Not found</div>} />

  <Route path="dev/workflow-tasks-editor" handler={require './components/workflow-tasks-editor'} />
  <Route path="dev/classifier" handler={require './classifier'} />
  <Route path="dev/aggregate" handler={require './components/aggregate-view'} />
</Route>

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

Router.run routes, (Handler, handlerProps) ->
  React.render(<Handler {...handlerProps} />, mainContainer);
