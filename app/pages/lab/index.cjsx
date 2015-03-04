React = require 'react'
{Link, RouteHandler} = require 'react-router'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
PromiseToSetState = require '../../lib/promise-to-set-state'
auth = require '../../api/auth'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'

EditProjectPage = React.createClass
  displayName: 'EditProjectPage'

  getDefaultProps: ->
    project: id: '2'

  render: ->
    linkParams =
      projectID: @props.project.id

    <div className="columns-container">
      <div>
        <ul>
          <li><Link to="edit-project-details" params={linkParams}>Project details</Link></li>
          <li><Link to="edit-project-science-case" params={linkParams}>Science case</Link></li>
          <li><Link to="edit-project-results" params={linkParams}>Results</Link></li>
          <li><Link to="edit-project-faq" params={linkParams}>FAQ</Link></li>
          <li><Link to="edit-project-education" params={linkParams}>Education</Link></li>
          <li><Link to="edit-project-collaborators" params={linkParams}>Collaborators</Link></li>
          <li>
            <header>Workflows</header>
            <ul>
              <li><Link to="edit-project-workflow" params={projectID: '2', workflowID: '2'}>Get started</Link></li>
              <li><button type="button">New workflow</button></li>
            </ul>
          </li>
          <li>
            <header>Subject sets</header>
            <ul>
              <li><Link to="edit-project-subject-set" params={projectID: '2', subjectSetID: '2'}>Get started expert subjects</Link></li>
              <li><Link to="edit-project-subject-set" params={projectID: '2', subjectSetID: '2'}>Get started initial subjects</Link></li>
              <li><button type="button">New subject set</button></li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="column">
        <RouteHandler {...@props} />
      </div>
    </div>

module.exports = React.createClass
  displayName: 'EditProjectPageWrapper'

  mixins: [TitleMixin, HandlePropChanges, PromiseToSetState]

  title: ->
    "Edit #{@state.project?.display_name ? '(Loading)'}"

  getDefaultProps: ->
    params: null

  getInitialState: ->
    project: null

  propChangeHandlers:
    'params.projectID': 'fetchProject'

  componentDidMount: ->
    auth.listen 'change', @fetchProject

  componentWillUnmount: ->
    auth.stopListening 'change', @fetchProject

  fetchProject: (_, props = @props) ->
    @promiseToSetState project: auth.checkCurrent().then ->
      apiClient.type('projects').get props.params.projectID

  render: ->
    if @state.project?
      <ChangeListener target={@state.project}>{=>
        <EditProjectPage project={@state.project} />
      }</ChangeListener>
    else
      <div className="content-container">
        {if @state.rejected.project?
          <code>{@state.rejected.project.toString()}</code>
        else
          <code>Loading</code>}
      </div>
