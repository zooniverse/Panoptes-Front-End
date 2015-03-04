React = require 'react'
{Link, RouteHandler} = require 'react-router'
PromiseRenderer = require '../../components/promise-renderer'
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
            <PromiseRenderer promise={@props.project.get 'workflows'}>{(workflows) =>
              <ul>
                {for workflow in workflows
                  workflowLinkParams = Object.create linkParams
                  workflowLinkParams.workflowID = workflow.id
                  <li key={workflow.id}>
                    <Link to="edit-project-workflow" params={workflowLinkParams}>{workflow.display_name}</Link>
                  </li>}
                <li><button type="button" disabled>New workflow</button></li>
              </ul>
            }</PromiseRenderer>
          </li>
          <li>
            <header>Subject sets</header>
            <PromiseRenderer promise={@props.project.get 'subject_sets'}>{(subjectSets) =>
              <ul>
                {for subjectSet in subjectSets
                  subjectSetLinkParams = Object.create linkParams
                  subjectSetLinkParams.subjectSetID = subjectSet.id
                  <li key={subjectSet.id}>
                    <Link to="edit-project-subject-set" params={subjectSetLinkParams}>{subjectSet.display_name}</Link>
                  </li>}
                <li><button type="button" disabled>New subject set</button></li>
              </ul>
            }</PromiseRenderer>
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
