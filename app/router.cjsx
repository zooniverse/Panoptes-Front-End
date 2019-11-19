Router = {IndexRoute, IndexRedirect, Route, Redirect} = require 'react-router'
React = require 'react'
createReactClass = require 'create-react-class'

`import ProjectsPage from './pages/projects/index';`
`import FilteredProjectsList from './pages/projects/filtered-projects-list';`
`import CollectionPageWrapper from './collections/show';`
`import CollectionSettings from './collections/settings';`
`import CollectionCollaborators from './collections/collaborators';`
`import ProjectHomePage from './pages/project/home';`
`import AboutProject from './pages/project/about/index';`
`import { AboutProjectResearch, AboutProjectEducation, AboutProjectFAQ, AboutProjectResults } from './pages/project/about/simple-pages';`
`import AboutProjectTeam from './pages/project/about/team';`
`import UserSettingsList from './pages/admin/user-settings-list';`
`import UserSettings from './pages/admin/user-settings';`
`import ProjectStatusList from './pages/admin/project-status-list';`
`import ProjectStatus from './pages/admin/project-status';`
`import Grantbot from './pages/admin/grantbot';`
`import OrganizationStatusList from './pages/admin/organization-status-list';`
`import OrganizationStatus from './pages/admin/organization-status';`
`import EditMediaPage from './pages/lab/media';`
`import UserProfilePage from './pages/profile/index';`
`import NotificationsPage from './pages/notifications';`
`import SubjectPageController from './subjects';`
`import WorkflowsPage from './pages/lab/workflows';`
`import WorkflowsContainer from './pages/lab/workflows-container';`
`import WorkflowsList from './pages/lab/workflows';`
`import SubjectSetsContainer from './pages/lab/subject-sets-container';`
`import SubjectSetsList from './pages/lab/subject-sets';`
`import TranslationsManager from './pages/lab/translations';`
`import UnsubscribeFromEmails from './pages/unsubscribe';`
`import HomePageRoot from './pages/home';`
`import PrivacyPolicy from './pages/privacy-policy';`
`import YouthPrivacyPolicy from './pages/youth-privacy-policy';`
`import SecurityPolicy from './pages/security-policy';`
`import AdminPage from './pages/admin';`
`import SignInPage from './pages/sign-in';`
`import NotFoundPage from './pages/not-found';`
`import ResetPasswordPage from './pages/reset-password/reset-password';`
`import Recents from './pages/profile/recents';`
`import AccountInformationPage from './pages/settings/AccountInformationPage';`
`import CustomiseProfile from './pages/settings/CustomiseProfile';`
`import EmailSettingsPage from './pages/settings/email';`
`import AboutPage from './pages/about/index';`
`import AboutHome from './pages/about/about-home';`
`import PublicationsPage from './pages/about/publications-page';`
`import TeamPage from './pages/about/team-page';`
`import Acknowledgements from './pages/about/acknowledgements';`
`import Contact from './pages/about/contact';`
`import Faq from './pages/about/faq';`
`import Highlights from './pages/about/highlights';`
`import Donate from './pages/about/donate';`
`import GetInvolved from './pages/get-involved/index';`
`import CallForProjects from './pages/get-involved/call-for-projects';`
`import Education from './pages/get-involved/education';`
`import Volunteering from './pages/get-involved/volunteering';`
`import DevClassifierPage from './pages/dev-classifier';`
`import Resources from './pages/about/resources-page';`
`import DataExports from './pages/lab/data-exports';`

# <Redirect from="home" to="/" /> doesn't work.
ONE_UP_REDIRECT = createReactClass
  componentDidMount: ->
    givenPathSegments = @props.location.pathname.split '/'
    givenPathSegments.pop()
    pathOneLevelUp = givenPathSegments.join '/'
    @props.history.replace
      pathname: pathOneLevelUp,
      query: @props.location.query

  render: ->
    null

# Used to force a refresh on entering a route, causing it to be fetched from
# the server - and allowing us to reverse proxy other apps to routes in PFE.
#
# Usage: <Route path="path/to/location" component={RELOAD} />
RELOAD = createReactClass
  componentDidMount: ->
    if window.location.hostname is 'www.zooniverse.org'
      window.location.reload()
    else
      window.location = @props.newUrl
  render: ->
    null

module.exports =
  <Route path="/" component={require './partials/app'}>
    <IndexRoute component={HomePageRoot} />
    <Route path="home" component={ONE_UP_REDIRECT} />
    <Route path="home-for-user" component={require('./pages/home-for-user').default} />

    <Route path="about" component={AboutPage} ignoreScrollBehavior>
      <IndexRoute component={AboutHome} />
      <Route path="team" component={TeamPage} />
      <Route path="publications" component={() => <RELOAD newUrl='https://fe-content-pages.zooniverse.org/about/publications' />} />
      <Route path="acknowledgements" component={Acknowledgements} />
      <Route path="resources" component={Resources} />
      <Route path="contact" component={Contact} />
      <Route path="faq" component={Faq} />
      <Route path="highlights" component={Highlights} />
      <Route path="donate" component={Donate} />
    </Route>


    <Route path="get-involved" component={GetInvolved} ignoreScrollBehavior>
      <IndexRoute component={Volunteering} />
      <Route path="call-for-projects" component={CallForProjects} />
      <Route path="education" component={Education} />
      <Redirect from="callForProjects" to="call-for-projects" />
    </Route>

    <Route path="reset-password" component={ResetPasswordPage} />

    <Route path="unsubscribe" component={UnsubscribeFromEmails} />

    <Route path="accounts" component={SignInPage}>
      <IndexRoute component={require './partials/sign-in-form'} />
      <Route path="sign-in" component={require './partials/sign-in-form'} />
      <Route path="register" component={require './partials/register-form'} />
    </Route>
    <Route path="privacy" component={PrivacyPolicy} />
    <Route path="youth_privacy" component={YouthPrivacyPolicy} />
    <Route path="security" component={SecurityPolicy} />

    <Route path="users/:profile_name" component={UserProfilePage}>
      <IndexRoute component={require './pages/profile/feed'} />
      <Route path="favorites" component={require('./pages/collections/favorites-list')} />
      <Route path="collections" component={require('./pages/collections/collections-list')} />
      <Route path="message" component={require './pages/profile/private-message'} />
      <Route path="stats" component={require './pages/profile/stats'} />
    </Route>

    <Route path="inbox" component={require './talk/inbox'} />
    <Route path="inbox/:conversation" component={require './talk/inbox-conversation'} />

    <Route path="settings" component={require './pages/settings'}>
      <IndexRoute component={AccountInformationPage} />
      <Route path="profile" component={CustomiseProfile} />
      <Route path="email" component={EmailSettingsPage} />
    </Route>

    <Route path="projects" component={ProjectsPage}>
      <IndexRoute component={FilteredProjectsList} />
    </Route>

    <Route path="/projects/nora-dot-eisner/planet-hunters-tess/classify" component={() => <RELOAD newUrl='https://fe-project.zooniverse.org/projects/nora-dot-eisner/planet-hunters-tess/classify' />} />
    <Route path="projects/:owner/:name" component={require('./pages/project').default}>
      <IndexRoute component={ProjectHomePage} />
      <Route path="home" component={ONE_UP_REDIRECT} />
      <Route path="classify" component={require('./pages/project/classify').default} />
      <Redirect from="research" to="about/research"/>
      <Redirect from="results" to="about/results"/>
      <Redirect from="faq" to="about/faq"/>
      <Redirect from="education" to="about/education"/>
      <Route path="about" component={AboutProject}>
        <IndexRedirect to="research" />
        <Route path="research" component={AboutProjectResearch} />
        <Route path="results" component={AboutProjectResults} />
        <Route path="faq" component={AboutProjectFAQ} />
        <Route path="education" component={AboutProjectEducation} />
        <Route path="team" component={AboutProjectTeam} />
      </Route>
      <Route path="notifications" component={NotificationsPage} />
      <Route path="talk" component={require './pages/project/talk'}>
        <IndexRoute component={require './talk/init'} />
        <Route path="recents" component={require './talk/recents'} />
        <Route path="not-found" component={NotFoundPage} />
        <Route path="search" component={require './talk/search'} />
        <Route path="moderations" component={require './talk/moderations'} />
        <Route path="subjects/:id" component={SubjectPageController} />
        <Route path="recents/:board" component={require './talk/recents'} />
        <Route path="tags/:tag" component={require './talk/tags'} />
        <Route path=":board" component={require './talk/board'} />
        <Route path=":board/:discussion" component={require './talk/discussion'} />
      </Route>
      <Route path="stats" component={require './pages/project/stats'} />
      <Route path="favorites" component={require('./pages/collections/index')}>
        <IndexRoute component={require('./pages/collections/favorites-list')} />
        <Route path=":collection_owner" component={require('./pages/collections/favorites-list')} />
      </Route>

      <Route path="collections" component={require('./pages/collections/index')}>
         <IndexRoute component={require('./pages/collections/collections-list')} />
         <Route path=":collection_owner" component={require('./pages/collections/collections-list')} />
      </Route>

      <Route path="collections/:collection_owner/:collection_name" component={CollectionPageWrapper}>
        <IndexRoute component={require './collections/show-list'} />
        <Route path="settings" component={CollectionSettings} />
        <Route path="collaborators" component={CollectionCollaborators} />
        <Route path="talk" component={require './collections/show-list'} />
      </Route>
      <Route path="users/:profile_name" component={UserProfilePage}>
        <IndexRoute component={require './pages/profile/feed'} />
        <Route path="favorites" component={require('./pages/collections/favorites-list')} />
        <Route path="collections" component={require('./pages/collections/collections-list')} />
        <Route path="message" component={require './pages/profile/private-message'} />
      </Route>
      <Route path="recents" component={Recents} />
    </Route>

    <Route path="organizations/:owner/:name" component={(require './pages/organization/organization-container').default}>
      <IndexRoute component={(require './pages/organization/organization-page').default} />
      <Route path="home" component={ONE_UP_REDIRECT} />
    </Route>

    <Route path="notifications" component={NotificationsPage} />
    <Route path=":section/notifications" component={NotificationsPage} />

    <Route path="talk" component={require './talk'}>
      <IndexRoute component={require './talk/init'} />
      <Route path="recents" component={require './talk/recents'} />
      <Route path="not-found" component={NotFoundPage} />
      <Route path="search" component={require './talk/search'} />
      <Route path="moderations" component={require './talk/moderations'} />
      <Route path=":board" component={require './talk/board'} />
      <Route path="recents/:board" component={require './talk/recents'} />
      <Route name="talk-discussion" path=":board/:discussion" component={require './talk/discussion'} />
    </Route>

    <Route path="favorites" component={require('./pages/collections')}>
      <IndexRoute component={require('./pages/collections/favorites-list')} />
      <Route path=":collection_owner" component={require('./pages/collections/favorites-list')} />
    </Route>

    <Route path="collections" component={require('./pages/collections')}>
       <IndexRoute component={require('./pages/collections/collections-list')} />
       <Route path=":collection_owner" component={require('./pages/collections/collections-list')} />
    </Route>

    <Route path="collections/:collection_owner/:collection_name" component={CollectionPageWrapper}>
      <IndexRoute component={require './collections/show-list'} />
      <Route path="settings" component={CollectionSettings} />
      <Route path="collaborators" component={CollectionCollaborators} />
      <Route path="talk" component={require './collections/show-list'} />
    </Route>

    <Route path="lab" component={require './pages/lab'} />
    <Route path="lab/:projectID" component={require './pages/lab/project'}>
      <IndexRoute component={require './pages/lab/project-details'} />
      <Route path="about" component={require './pages/lab/about'}>
        <IndexRedirect to='research' />
        <Route path="research" component={require './pages/lab/about/research'} />
        <Route path="results" component={require './pages/lab/about/results'} />
        <Route path="faq" component={require './pages/lab/about/faq'} />
        <Route path="education" component={require './pages/lab/about/education'} />
        <Route path="team" component={require './pages/lab/about/team'} />
      </Route>
      <Route path="collaborators" component={require './pages/lab/collaborators'} />
      <Route path="media" component={EditMediaPage} />
      <Route path="visibility" component={require './pages/lab/visibility'} />
      <Route path="talk" component={require './pages/lab/talk'} />
      <Route path="data-exports" component={DataExports} />
      <Route path="tutorial" component={require './pages/lab/tutorial'} />
      <Route path="guide" component={require './pages/lab/field-guide'} />
      <Redirect from="workflow/*" to="workflows/*" />
      <Route path="workflows" component={WorkflowsContainer}>
        <IndexRoute component={WorkflowsList} />
        <Route path=":workflowID" component={require './pages/lab/workflow'} />
      </Route>
      <Redirect from="subject-set/*" to="subject-sets/*" />
      <Route path="subject-sets" component={SubjectSetsContainer}>
        <IndexRoute component={SubjectSetsList} />
        <Route path=":subjectSetID" component={require './pages/lab/subject-set'} />
      </Route>
      <Route path="mini-course" component={require './pages/lab/mini-course'} />
      <Route path="translations" component={TranslationsManager} />
    </Route>

    <Route path="admin" component={AdminPage}>
      <IndexRoute component={UserSettingsList} />
      <Route path="users" component={UserSettingsList} />
      <Route path="users/:id" component={UserSettings} />
      <Route path="project_status" component={ProjectStatusList} />
      <Route path="project_status/:owner/:name" component={ProjectStatus} />
      <Route path="grantbot" component={Grantbot} />
      <Route path="organization-status" component={OrganizationStatusList} />
      <Route path="organization-status/:owner/:name" component={OrganizationStatus} />
    </Route>

    <Route path="todo" component={-> <div className="content-container"><i className="fa fa-cogs"></i> TODO</div>} />
    <Route path="dev/workflow-tasks-editor" component={require './components/workflow-tasks-editor'} />
    <Route path="dev/classifier" component={
      if process.env.NODE_ENV is 'production'
        NotFoundPage
      else
        DevClassifierPage
    } />
    <Route path="*" component={NotFoundPage} />
  </Route>
