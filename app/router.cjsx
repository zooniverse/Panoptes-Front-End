Router = {IndexRoute, IndexRedirect, Route, Redirect} = require 'react-router'
React = require 'react'
createReactClass = require 'create-react-class'

`import EditProjectTalk from './pages/lab/talk';`
`import EditMediaPage from './pages/lab/media';`
`import WorkflowsPage from './pages/lab/workflows';`
`import WorkflowsContainer from './pages/lab/workflows-container';`
`import WorkflowsList from './pages/lab/workflows';`
`import SubjectSetsContainer from './pages/lab/subject-sets-container';`
`import SubjectSetsList from './pages/lab/subject-sets';`
`import TranslationsManager from './pages/lab/translations';`
`import NotFoundPage from './pages/not-found';`

`import DataExports from './pages/lab/data-exports';`

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

ExternalRedirect = createReactClass
  componentDidMount: ->
    if @props.newUrl
      window.location = @props.newUrl
  render: ->
    null

module.exports =
  <Route path="/" component={require './partials/app'}>
    <IndexRoute component={require './pages/lab'} />

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
      <Route path="talk" component={EditProjectTalk} />
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

    <Route path="*" component={NotFoundPage} />
  </Route>
