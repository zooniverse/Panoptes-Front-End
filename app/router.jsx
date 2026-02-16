import {IndexRoute, IndexRedirect, Route, Redirect} from 'react-router'
import React from 'react'

import CollectionPageWrapper from './collections/show';
import CollectionSettings from './collections/settings';
import CollectionCollaborators from './collections/collaborators';
import ProjectHomePage from './pages/project/home';
import ProjectClassifyPage from './pages/project/classify';
import AboutProject from './pages/project/about/index';
import { AboutProjectResearch, AboutProjectEducation, AboutProjectFAQ, AboutProjectResults } from './pages/project/about/simple-pages';
import AboutProjectTeam from './pages/project/about/team';
import SubjectAdmin from './pages/admin/subject';
import UserSettingsList from './pages/admin/user-settings-list';
import UserSettings from './pages/admin/user-settings';
import ProjectStatusList from './pages/admin/project-status-list';
import ProjectStatus from './pages/admin/project-status';
import Grantbot from './pages/admin/grantbot';
import OrganizationStatusList from './pages/admin/organization-status-list';
import OrganizationStatus from './pages/admin/organization-status';
import EditProjectTalk from './pages/lab/talk';
import EditMediaPage from './pages/lab/media';
import UserProfilePage from './pages/profile/index';
import NotificationsPage from './pages/notifications';
import SubjectPageController from './subjects';
import WorkflowsContainer from './pages/lab/workflows-container';
import WorkflowsList from './pages/lab/workflows';
import SubjectSetsContainer from './pages/lab/subject-sets-container';
import SubjectSetsList from './pages/lab/subject-sets';
import TranslationsManager from './pages/lab/translations';
import UnsubscribeFromEmails from './pages/unsubscribe';
import PrivacyPolicy from './pages/privacy-policy';
import YouthPrivacyPolicy from './pages/youth-privacy-policy';
import SecurityPolicy from './pages/security-policy';
import AdminPage from './pages/admin';
import SignInPage from './pages/sign-in';
import AccountsPage from './pages/accounts';
import RubinPage from './rubin-2025/rubin-page.jsx';  // Part of Rubin 2025 project. See /app/rubin-2025
import NotFoundPage from './pages/not-found';
import ResetPasswordPage from './pages/reset-password/reset-password';
import Recents from './pages/profile/recents';
import AccountInformationPage from './pages/settings/AccountInformationPage';
import CustomiseProfile from './pages/settings/CustomiseProfile';
import EmailSettingsPage from './pages/settings/email';
import DevClassifierPage from './pages/dev-classifier';
import DataExports from './pages/lab/data-exports';
import TalkTags from './talk/tags';
import FEMLabRouter from './pages/lab-fem/fem-lab-router'
import IIIFSubjectSet from './pages/lab/iiif'
import projectLab from './pages/lab/project.jsx'
import Collaborators from './pages/lab/collaborators.jsx'
import PagesEditor from './pages/lab-pages-editor'
import ProjectStatsPage from './pages/project/stats'
import ProjectPageController from './pages/project/index'
import PFE_SLUGS from './slugList.js';

// <Redirect from="home" to="/" /> doesn't work.
class ONE_UP_REDIRECT extends React.Component {
  componentDidMount () {
    let givenPathSegments = this.props.location.pathname.split('/')
    givenPathSegments.pop()
    const pathOneLevelUp = givenPathSegments.join('/')
    this.props.router.replace(pathOneLevelUp, this.props.location.query)
  }

  render () {
    return null
  }
}

/**
 * Redirect project pages to the static proxy unless the project slug is whitelisted in PFE_SLUGS.
 * @param {Object} nextState
 * @param {Object} nextState.params
 * @param {string} nextState.params.owner
 * @param {string} nextState.params.name
 * @param {Function} replace 
 * @param {Function} done 
 */
function redirectPfeToFem(nextState, replace, done) {
  try {
    const { owner, name } = nextState.params
    const isPFEProject = PFE_SLUGS.includes(`${owner}/${name}`)
    if (isPFEProject) {
      done()
    } else {
      redirectToStaticProxy(nextState, replace, done)
    }
  } catch (error) {
    done(error)
  }
}

/**
 * Client-side redirect a route to the static proxy, by replacing the browser window location.
 * @param {Object} nextState
 * @param {Object} nextState.location
 * @param {string} nextState.location.pathname
 * @param {string} nextState.location.search
 * @param {Function} replace 
 * @param {Function} done 
 */
function redirectToStaticProxy(nextState, replace, done) {
  try {
    const { pathname, search } = nextState.location
    let newUrl = `https://frontend.preview.zooniverse.org${pathname}${search}`
    if (window.location.hostname === 'www.zooniverse.org') {
      newUrl = `https://www.zooniverse.org${pathname}{search}`
    }
    window.location.replace(newUrl)
    done()
  } catch (error) {
    done(error)
  }
}

class ExternalRedirect extends React.Component {
  componentDidMount () {
    if (this.props.newUrl) {
      window.location = this.props.newUrl
    }
  }

  render () {
    return null
  }
}

export const routes = (
  <Route path="/" component={require('./partials/app')}>
    <IndexRoute component={() => <ExternalRedirect newUrl='https://www.zooniverse.org' />} />
    <Route path="home" component={ONE_UP_REDIRECT} />

    <Route path="reset-password" component={ResetPasswordPage} />

    <Route path="unsubscribe" component={UnsubscribeFromEmails} />

    <Route path="accounts-old" component={SignInPage}>
      <IndexRoute component={require('./partials/sign-in-form')} />
      <Route path="sign-in" component={require('./partials/sign-in-form')} />
      <Route path="register" component={require('./partials/register-form')} />
    </Route>

    <Route path="accounts" component={AccountsPage}>
      <Route path="sign-in" />
      <Route path="register" />
    </Route>

    {/* Part of Rubin 2025 project. See /app/rubin-2025 */}
    <Route path="rubin" component={RubinPage}>
      <Route path="sign-in" />
      <Route path="register" />
    </Route>

    <Route path="privacy" component={PrivacyPolicy} />
    <Route path="youth_privacy" component={YouthPrivacyPolicy} />
    <Route path="security" component={SecurityPolicy} />

    <Route path="users/:profile_name" component={UserProfilePage}>
      <IndexRoute component={require('./pages/profile/feed')} />
      <Route path="favorites" component={require('./pages/collections/favorites-list')} />
      <Route path="collections" component={require('./pages/collections/collections-list')} />
      <Route path="message" component={require('./pages/profile/private-message')} />
      <Route path="stats" component={require('./pages/profile/stats')} />
    </Route>

    <Route path="inbox" component={require('./talk/inbox')} />
    <Route path="inbox/:conversation" component={require('./talk/inbox-conversation')} />

    <Route path="settings" component={require('./pages/settings')}>
      <IndexRoute component={AccountInformationPage} />
      <Route path="profile" component={CustomiseProfile} />
      <Route path="email" component={EmailSettingsPage} />
    </Route>

    <Route path="/projects/mschwamb/planet-four/authors" component={() => <ExternalRedirect newUrl='https://authors.planetfour.org/' />} />

    {/* By default, all project homepages, classify pages, and about pages redirect to the
    static proxy UNLESS the project is whitelisted to stay on PFE's classifier. */}
    <Route path="projects/:owner/:name" component={ProjectPageController}>
      <IndexRoute onEnter={redirectPfeToFem} component={ProjectHomePage} />
      <Route path="home" component={ONE_UP_REDIRECT} />
      <Route path="classify" onEnter={redirectPfeToFem} component={ProjectClassifyPage} />
      <Redirect from="research" to="about/research"/>
      <Redirect from="results" to="about/results"/>
      <Redirect from="faq" to="about/faq"/>
      <Redirect from="education" to="about/education"/>
      <Route path="about" onEnter={redirectPfeToFem} component={AboutProject}>
        <IndexRedirect to="research" />
        <Route path="research" onEnter={redirectPfeToFem} component={AboutProjectResearch} />
        <Route path="results" onEnter={redirectPfeToFem} component={AboutProjectResults} />
        <Route path="faq" onEnter={redirectPfeToFem} component={AboutProjectFAQ} />
        <Route path="education" onEnter={redirectPfeToFem} component={AboutProjectEducation} />
        <Route path="team" onEnter={redirectPfeToFem} component={AboutProjectTeam} />
      </Route>
      <Route path="notifications" component={NotificationsPage} />
      <Route path="talk" component={require('./pages/project/talk')}>
        <IndexRoute component={require('./talk/init')} />
        <Route path="recents" component={require('./talk/recents')} />
        <Route path="not-found" component={NotFoundPage} />
        <Route path="search" component={require('./talk/search')} />
        <Route path="moderations" component={require('./talk/moderations')} />
        <Route path="subjects/:id" component={SubjectPageController} />
        <Route path="recents/:board" component={require('./talk/recents')} />
        <Route path="tags/:tag" component={TalkTags} />
        <Route path=":board" component={require('./talk/board')} />
        <Route path=":board/:discussion" component={require('./talk/discussion')} />
      </Route>
      <Route path="stats" component={ProjectStatsPage} />
      <Route path="favorites" component={require('./pages/collections/index')}>
        <IndexRoute component={require('./pages/collections/favorites-list')} />
        <Route path=":collection_owner" component={require('./pages/collections/favorites-list')} />
      </Route>

      <Route path="collections" component={require('./pages/collections/index')}>
         <IndexRoute component={require('./pages/collections/collections-list')} />
         <Route path=":collection_owner" component={require('./pages/collections/collections-list')} />
      </Route>

      <Route path="collections/:collection_owner/:collection_name" component={CollectionPageWrapper}>
        <IndexRoute component={require('./collections/show-list').default} />
        <Route path="settings" component={CollectionSettings} />
        <Route path="collaborators" component={CollectionCollaborators} />
        <Route path="talk" component={require('./collections/show-list').default} />
      </Route>
      <Route path="users/:profile_name" component={UserProfilePage}>
        <IndexRoute component={require('./pages/profile/feed')} />
        <Route path="favorites" component={require('./pages/collections/favorites-list')} />
        <Route path="collections" component={require('./pages/collections/collections-list')} />
        <Route path="message" component={require('./pages/profile/private-message')} />
      </Route>
      <Route path="recents" component={Recents} />
    </Route>

    {/*
      This is FEM's projects/locale pattern. These routes only apply if the react-router
      somehow intercepts a request to i.e /projects/es/penguintom79/penguin-watch
    */}
    <Route path="projects/:locale/:owner/:name" component={ProjectPageController}>
      <IndexRoute onEnter={redirectPfeToFem} component={ProjectHomePage} />
      <Route path="home" component={ONE_UP_REDIRECT} />
      <Route path="classify" onEnter={redirectPfeToFem} component={ProjectClassifyPage} />
      <Redirect from="research" to="about/research"/>
      <Redirect from="results" to="about/results"/>
      <Redirect from="faq" to="about/faq"/>
      <Redirect from="education" to="about/education"/>
      <Route path="about" onEnter={redirectPfeToFem} component={AboutProject}>
        <IndexRedirect to="research" />
        <Route path="research" onEnter={redirectPfeToFem} component={AboutProjectResearch} />
        <Route path="results" onEnter={redirectPfeToFem} component={AboutProjectResults} />
        <Route path="faq" onEnter={redirectPfeToFem} component={AboutProjectFAQ} />
        <Route path="education" onEnter={redirectPfeToFem} component={AboutProjectEducation} />
        <Route path="team" onEnter={redirectPfeToFem} component={AboutProjectTeam} />
      </Route>
      <Route path="notifications" component={NotificationsPage} />
      <Route path="talk" component={require('./pages/project/talk')}>
        <IndexRoute component={require('./talk/init')} />
        <Route path="recents" component={require('./talk/recents')} />
        <Route path="not-found" component={NotFoundPage} />
        <Route path="search" component={require('./talk/search')} />
        <Route path="moderations" component={require('./talk/moderations')} />
        <Route path="subjects/:id" component={SubjectPageController} />
        <Route path="recents/:board" component={require('./talk/recents')} />
        <Route path="tags/:tag" component={TalkTags} />
        <Route path=":board" component={require('./talk/board')} />
        <Route path=":board/:discussion" component={require('./talk/discussion')} />
      </Route>
      <Route path="stats" component={ProjectStatsPage} />
      <Route path="favorites" component={require('./pages/collections/index')}>
        <IndexRoute component={require('./pages/collections/favorites-list')} />
        <Route path=":collection_owner" component={require('./pages/collections/favorites-list')} />
      </Route>

      <Route path="collections" component={require('./pages/collections/index')}>
         <IndexRoute component={require('./pages/collections/collections-list')} />
         <Route path=":collection_owner" component={require('./pages/collections/collections-list')} />
      </Route>

      <Route path="collections/:collection_owner/:collection_name" component={CollectionPageWrapper}>
        <IndexRoute component={require('./collections/show-list').default} />
        <Route path="settings" component={CollectionSettings} />
        <Route path="collaborators" component={CollectionCollaborators} />
        <Route path="talk" component={require('./collections/show-list').default} />
      </Route>
      <Route path="users/:profile_name" component={UserProfilePage}>
        <IndexRoute component={require('./pages/profile/feed')} />
        <Route path="favorites" component={require('./pages/collections/favorites-list')} />
        <Route path="collections" component={require('./pages/collections/collections-list')} />
        <Route path="message" component={require('./pages/profile/private-message')} />
      </Route>
      <Route path="recents" component={Recents} />
    </Route>

    <Route path="organizations/:owner/:name" component={(require('./pages/organization/organization-container').default)}>
      <IndexRoute component={(require('./pages/organization/organization-page').default)} />
      <Route path="home" component={ONE_UP_REDIRECT} />
      <Route path="stats" component={(require('./pages/organization/stats').default)} />
    </Route>

    <Route path="notifications" component={NotificationsPage} />
    <Route path=":section/notifications" component={NotificationsPage} />

    <Route path="talk" component={require('./talk')}>
      <IndexRoute component={require('./talk/init')} />
      <Route path="recents" component={require('./talk/recents')} />
      <Route path="not-found" component={NotFoundPage} />
      <Route path="search" component={require('./talk/search')} />
      <Route path="moderations" component={require('./talk/moderations')} />
      <Route path=":board" component={require('./talk/board')} />
      <Route path="recents/:board" component={require('./talk/recents')} />
      <Route name="talk-discussion" path=":board/:discussion" component={require('./talk/discussion')} />
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
      <IndexRoute component={require('./collections/show-list').default} />
      <Route path="settings" component={CollectionSettings} />
      <Route path="collaborators" component={CollectionCollaborators} />
      <Route path="talk" component={require('./collections/show-list').default} />
    </Route>

    <Route path="lab" component={require('./pages/lab')} />
    <Route path="lab/:projectID" component={projectLab}>
      <IndexRoute component={require('./pages/lab/project-details')} />
      <Route path="about" component={require('./pages/lab/about')}>
        <IndexRedirect to='research' />
        <Route path="research" component={require('./pages/lab/about/research')} />
        <Route path="results" component={require('./pages/lab/about/results')} />
        <Route path="faq" component={require('./pages/lab/about/faq')} />
        <Route path="education" component={require('./pages/lab/about/education')} />
        <Route path="team" component={require('./pages/lab/about/team')} />
      </Route>
      <Route path="collaborators" component={Collaborators} />
      <Route path="media" component={EditMediaPage} />
      <Route path="visibility" component={require('./pages/lab/visibility')} />
      <Route path="talk" component={EditProjectTalk} />
      <Route path="data-exports" component={DataExports} />
      <Route path="tutorial" component={require('./pages/lab/tutorial')} />
      <Route path="guide" component={require('./pages/lab/field-guide')} />
      <Redirect from="workflow/*" to="workflows/*" />
      <Route path="workflows" component={WorkflowsContainer}>
        <IndexRoute component={WorkflowsList} />
        <Route path="editor/:workflowID" component={PagesEditor} />
        <Route path=":workflowID" component={FEMLabRouter} />
      </Route>
      <Redirect from="subject-set/*" to="subject-sets/*" />
      <Route path="subject-sets" component={SubjectSetsContainer}>
        <IndexRoute component={SubjectSetsList} />
        <Route path="iiif" component={IIIFSubjectSet} />
        <Route path=":subjectSetID" component={require('./pages/lab/subject-set')} />
      </Route>
      <Route path="mini-course" component={require('./pages/lab/mini-course')} />
      <Route path="translations" component={TranslationsManager} />
    </Route>

    <Route path="admin" component={AdminPage}>
      <IndexRoute component={UserSettingsList} />
      <Route path="users" component={UserSettingsList} />
      <Route path="users/:id" component={UserSettings} />
      <Route path="subjects/:id" component={SubjectAdmin} />
      <Route path="project_status" component={ProjectStatusList} />
      <Route path="project_status/:owner/:name" component={ProjectStatus} />
      <Route path="grantbot" component={Grantbot} />
      <Route path="organization-status" component={OrganizationStatusList} />
      <Route path="organization-status/:owner/:name" component={OrganizationStatus} />
    </Route>

    <Route path="dev/workflow-tasks-editor" component={require('./components/workflow-tasks-editor')} />
    <Route path="dev/classifier" component={(process.env.NODE_ENV === 'production')
      ? NotFoundPage
      : DevClassifierPage
    } />
    {/* Any routes not specified above should be handled by the monorepo apps. */}
    <Route path="*" onEnter={redirectToStaticProxy} />
  </Route>
)
