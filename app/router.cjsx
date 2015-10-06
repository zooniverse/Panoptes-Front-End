Router = {RouteHandler, DefaultRoute, Route, NotFoundRoute} = require '@edpaget/react-router'
React = require 'react'

routes =
<Route handler={require './partials/app'}>
  <DefaultRoute name="home" handler={require './pages/home'} />

  <Route name="about" path="about/?" handler={require './pages/about'} ignoreScrollBehavior>
    <DefaultRoute name="about-home" handler={require './pages/about/about-home'} />
    <Route name="about-team" path="team/?" handler={require './pages/about/team-page'} />
    <Route name="about-publications" path="publications/?" handler={require './pages/about/publications-page'} />
    <Route name="about-education" path="education/?" handler={require './pages/about/education-page'} />
    <Route name="about-contact" path="contact/?" handler={require './pages/about/contact-page'} />
  </Route>

  <Route name="reset-password" path="reset-password/?" handler={require './pages/reset-password'} />

  <Route name="unsubscribe" path="unsubscribe/?" handler={require './pages/unsubscribe'} />

  <Route path="accounts" handler={require './pages/sign-in'}>
    <Route name="sign-in" path="sign-in/?" handler={require './partials/sign-in-form'} />
    <Route name="register" path="register/?" handler={require './partials/register-form'} />
  </Route>
  <Route name="privacy" path="privacy/?" handler={require './pages/privacy-policy'} />

  <Route path="users/:name/?" handler={require './pages/profile'}>
    <DefaultRoute name="user-profile" handler={require './pages/profile/feed'} />
    <Route name="user-profile-private-message" path="message/?" handler={require './pages/profile/private-message'} />
    <Route name="user-profile-stats" path="stats/?" handler={require './pages/profile/stats'} />
  </Route>

  <Route name="inbox" path="inbox/?" handler={require './talk/inbox'} />
  <Route name="inbox-conversation" path="inbox/:conversation/?" handler={require './talk/inbox-conversation'} />

  <Route path="settings/?" handler={require './pages/settings'}>
    <DefaultRoute name="settings" handler={require './pages/settings/account'} />
    <Route name="profile-settings" path="profile/?" handler={require './pages/settings/profile' } />
    <Route name="email-settings" path="email/?" handler={require './pages/settings/email' } />
  </Route>

  <Route name="projects" path="projects/?" handler={require './pages/projects'} />
  <Route path="projects/:owner/:name/?" handler={require './pages/project'}>
    <DefaultRoute name="project-home" handler={require './pages/project/home'} />
    <Route name="project-research" path="research/?" handler={require './pages/project/research'} />
    <Route name="project-results" path="results/?" handler={require './pages/project/results'} />
    <Route name="project-classify" path="classify/?" handler={require './pages/project/classify'} />
    <Route name="project-notifications" path="notifications/?" handler={require './pages/notifications'} />
    <Route name="project-talk" path="talk/?" handler={require './pages/project/talk'}>
      <DefaultRoute name="project-talk-home" handler={require './talk/init'} />
      <Route name="project-talk-recents" path="recents/?" handler={require './talk/recents'} />
      <Route name="project-talk-not-found" path="not-found/?" handler={require './pages/not-found'} />
      <Route name="project-talk-search" path="search/?" handler={require './talk/search'}/>
      <Route name="project-talk-moderations" path="moderations/?" handler={require './talk/moderations'}/>
      <Route name="project-talk-subject" path="subjects/:id/?" handler={require './subjects'}/>
      <Route name="project-talk-board-recents" path="recents/:board/?" handler={require './talk/recents'} />
      <Route name="project-talk-board" path=":board/?" handler={require './talk/board'} />
      <Route name="project-talk-discussion" path=":board/:discussion/?" handler={require './talk/discussion'} />
    </Route>
    <Route name="project-faq" path="faq/?" handler={require './pages/project/faq'} />
    <Route name="project-education" path="education/?" handler={require './pages/project/education'} />
  </Route>

  <Route name="notifications" path="notifications/?" handler={require './pages/notifications'} />

  <Route name="talk" path="talk/?" handler={require './talk'}>
    <DefaultRoute name="talk-home" handler={require './talk/init'} />
    <Route name="talk-recents" path="recents/?" handler={require './talk/recents'} />
    <Route name="talk-not-found" path="not-found/?" handler={require './pages/not-found'} />
    <Route name="talk-search" path="search/?" handler={require './talk/search'} />
    <Route name="talk-moderations" path="moderations/?" handler={require './talk/moderations'} />
    <Route name="talk-board" path=":board/?" handler={require './talk/board'} />
    <Route name="talk-board-recents" path="recents/:board/?" handler={require './talk/recents'} />
    <Route name="talk-discussion" path=":board/:discussion/?" handler={require './talk/discussion'} />
  </Route>

  <Route name="favorites" path="favorites/?" handler={require('./pages/collections').FavoritesList}>
    <Route name="favorites-user" path=":owner/?" handler={require('./pages/collections').FavoritesList} />
  </Route>

  <Route name="collections" path="collections/?" handler={require('./pages/collections').CollectionsList}>
    <Route name="collections-user" path=":owner/?" handler={require('./pages/collections').CollectionsList} />
  </Route>
  <Route name="collection-show" path="collections/:owner/:name/?" handler={require './collections/show'}>
    <DefaultRoute name="collection-show-list" handler={require './collections/show-list'} />
    <Route name="collection-settings" path="settings/?" handler={require './collections/settings'} />
    <Route name="collection-collaborators" path="collaborators/?" handler={require './collections/collaborators'} />
    <Route name="collection-talk" path="talk/?" handler={require './collections/show-list'} />
  </Route>

  <Route name="lab" path="lab/?" handler={require './pages/lab'} />
  <Route path="lab/:projectID/?" handler={require './pages/lab/project'}>
    <DefaultRoute name="edit-project-details" handler={require './pages/lab/project-details'} />
    <Route name="edit-project-research" path="research/?" handler={require './pages/lab/research'} />
    <Route name="edit-project-results" path="results/?" handler={require './pages/lab/results'} />
    <Route name="edit-project-faq" path="faq/?" handler={require './pages/lab/faq'} />
    <Route name="edit-project-education" path="education/?" handler={require './pages/lab/education'} />
    <Route name="edit-project-collaborators" path="collaborators/?" handler={require './pages/lab/collaborators'} />
    <Route name="edit-project-media" path="media/?" handler={require './pages/lab/media'} />
    <Route name="edit-project-workflow" path="workflow/:workflowID/?" handler={require './pages/lab/workflow'} />
    <Route name="edit-project-subject-set" path="subject-set/:subjectSetID/?" handler={require './pages/lab/subject-set'} />
    <Route name="edit-project-visibility" path="visibility/?" handler={require './pages/lab/visibility'} />
    <Route name="edit-project-talk" path="talk/?" handler={require './pages/lab/talk'} />
    <Route name="get-data-exports" path="data-exports" handler={require './pages/lab/data-dumps'} />
  </Route>
  <Route name="lab-policies" path="lab-policies/?" handler={require './pages/lab/lab-policies'} />
  <Route name="lab-how-to" path="lab-how-to/?" handler={require './pages/lab/how-to-page'} />

  <Route name="admin" path="admin/?" handler={require './pages/admin'}>
    <DefaultRoute name="admin-create" handler={require './pages/admin/create'} />
    <Route name="admin-project-list" path="project_status/?" handler={require './pages/admin/project-status-list'} />
    <Route name="admin-project-status" path="project_status/:owner/:name/?" handler={require './pages/admin/project-status'} />
  </Route>

  <Route path="todo/?*" handler={React.createClass render: -> <div className="content-container"><i className="fa fa-cogs"></i> TODO</div>} />
  <NotFoundRoute handler={require './pages/not-found'} />

  <Route path="dev/workflow-tasks-editor" handler={require './components/workflow-tasks-editor'} />
  <Route path="dev/classifier" handler={require './classifier'} />
  <Route path="dev/aggregate" handler={require './components/aggregate-view'} />
  <Route path="dev/ribbon" handler={require './components/classifications-ribbon'} />
</Route>

location = if process.env.NON_ROOT == "true"
    null
  else
    Router.HistoryLocation

module.exports = Router.create { location, routes }
