React = require 'react'
React.initializeTouchEvents true
window.React = React
Router = {RouteHandler, DefaultRoute, Route, NotFoundRoute} = require 'react-router'
MainHeader = require './partials/main-header'
MainFooter = require './partials/main-footer'
IOStatus = require './partials/io-status'

logDeployedCommit = require './lib/log-deployed-commit'
logDeployedCommit()

App = React.createClass
  displayName: 'PanoptesApp'

  render: ->
    <div className="panoptes-main">
      <IOStatus />
      <MainHeader />
      <div className="main-content">
        <RouteHandler {...@props} />
      </div>
      <MainFooter />
    </div>

routes = <Route handler={App}>
  <DefaultRoute name="home" handler={require './pages/home'} />

  <Route name="about" path="about" handler={require './pages/about'} ignoreScrollBehavior>
    <DefaultRoute name="about-home" handler={require './pages/about/about-home'} />
    <Route name="about-team" path="team" handler={require './pages/about/team-page'} />
    <Route name="about-publications" path="publications" handler={require './pages/about/publications-page'} />
  </Route>

  <Route name="reset-password" handler={require './pages/reset-password'} />

  <Route path="account" handler={require './pages/sign-in'}>
    <Route name="sign-in" handler={require './partials/sign-in-form'} />
    <Route name="register" handler={require './partials/register-form'} />
  </Route>
  <Route name="privacy" handler={require './pages/privacy-policy'} />

  <Route name="user-profile" path="users/:name" handler={require './pages/profile'}>
    <DefaultRoute name="user-profile-feed" handler={require './pages/profile/feed'} />
    <Route name="user-profile-stats" path="stats" handler={require './pages/profile/stats'} />
    <Route name="inbox" handler={require './talk/inbox'} />
    <Route name="inbox-conversation" path="inbox/:conversation" handler={require './talk/inbox-conversation'} />
    <Route name="settings" path="settings" handler={require './pages/profile/settings'} />
  </Route>

  <Route name="projects" handler={require './pages/projects'} />
  <Route path="projects/:owner/:name" handler={require './pages/project'}>
    <DefaultRoute name="project-home" handler={require './pages/project/home'} />
    <Route name="project-science-case" path="science-case" handler={require './pages/project/science-case'} />
    <Route name="project-results" path="results" handler={require './pages/project/results'} />
    <Route name="project-classify" path="classify" handler={require './pages/project/classify'} />
    <Route name="project-talk" path="talk" handler={require './pages/project/talk'}>
      <DefaultRoute name="project-talk-home" handler={require './talk/init'} />
      <Route name="project-talk-search" path="search" handler={require './talk/search'}/>
      <Route name="project-talk-subject" path="subjects/:id" handler={require './subjects'}/>
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
    <DefaultRoute name="talk-home" handler={require './talk/init'} />
    <Route name="talk-search" path="search" handler={require './talk/search'} />
    <Route name="talk-board" path=":board" handler={require './talk/board'} />
    <Route name="talk-discussion" path=":board/:discussion" handler={require './talk/discussion'} />
  </Route>

  <Route name="collections" path="collections" handler={require './pages/collections'}>
    <Route name="collections-user" path=":owner" handler={require './pages/collections'} />
    <Route name="collection-show" path=":owner/:name" handler={require './collections/show'} />
  </Route>

  <Route name="lab" handler={require './pages/lab'} />
  <Route path="lab/:projectID" handler={require './pages/lab/project'}>
    <DefaultRoute name="edit-project-details" handler={require './pages/lab/project-details'} />
    <Route name="edit-project-science-case" path="science-case" handler={require './pages/lab/science-case'} />
    <Route name="edit-project-results" path="results" handler={require './pages/lab/results'} />
    <Route name="edit-project-faq" path="faq" handler={require './pages/lab/faq'} />
    <Route name="edit-project-education" path="education" handler={require './pages/lab/education'} />
    <Route name="edit-project-collaborators" path="collaborators" handler={require './pages/lab/collaborators'} />
    <Route name="edit-project-media" path="media" handler={require './pages/lab/media'} />
    <Route name="edit-project-workflow" path="workflow/:workflowID" handler={require './pages/lab/workflow'} />
    <Route name="edit-project-subject-set" path="subject-set/:subjectSetID" handler={require './pages/lab/subject-set'} />
    <Route name="edit-project-visibility" path="visibility" handler={require './pages/lab/visibility'} />
  </Route>

  <Route path="todo/?*" handler={React.createClass render: -> <div className="content-container"><i className="fa fa-cogs"></i> TODO</div>} />
  <NotFoundRoute handler={require './pages/not-found'} />

  <Route path="dev/workflow-tasks-editor" handler={require './components/workflow-tasks-editor'} />
  <Route path="dev/classifier" handler={require './classifier'} />
  <Route path="dev/aggregate" handler={require './components/aggregate-view'} />
</Route>

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

Router.run routes, (Handler, handlerProps) ->
  React.render(<Handler {...handlerProps} />, mainContainer);
