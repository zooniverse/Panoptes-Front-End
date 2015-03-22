React = require 'react'
{Navigation, Link, RouteHandler} = require 'react-router'
PromiseRenderer = require '../../components/promise-renderer'
LoadingIndicator = require '../../components/loading-indicator'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
PromiseToSetState = require '../../lib/promise-to-set-state'
auth = require '../../api/auth'
apiClient = require '../../api/client'
counterpart = require 'counterpart'
ChangeListener = require '../../components/change-listener'

DEFAULT_WORKFLOW_NAME = 'Untitled workflow'
DEFAULT_SUBJECT_SET_NAME = 'Untitled subject set'
DELETE_CONFIRMATION_PHRASE = 'I AM DELETING THIS PROJECT'

EditProjectPage = React.createClass
  displayName: 'EditProjectPage'

  mixins: [Navigation]

  getDefaultProps: ->
    project: id: '2'

  getInitialState: ->
    workflowCreationError: null
    workflowCreationInProgress: false
    subjectSetCreationError: null
    subjectSetCreationInProgress: false
    deletionError: null
    deletionInProgress: false

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
                <li>
                  <button type="button" onClick={@createNewWorkflow} disabled={@state.workflowCreationInProgress}>
                    New workflow{' '}
                    <LoadingIndicator off={not @state.workflowCreationInProgress} />
                  </button>{' '}
                  {if @state.workflowCreationError?
                    <div className="form-help error">{@state.workflowCreationError.message}</div>}
                </li>
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
                <li>
                  <button type="button" onClick={@createNewSubjectSet} disabled={@state.subjectSetCreationInProgress}>
                    New subject set{' '}
                    <LoadingIndicator off={not @state.subjectSetCreationInProgress} />
                  </button>{' '}
                  {if @state.subjectSetCreationError?
                    <div className="form-help error">{@state.subjectSetCreationError.message}</div>}
                </li>
              </ul>
            }</PromiseRenderer>
          </li>
        </ul>
        <button type="button" className="minor-button" onClick={@deleteProject}>Delete this project <LoadingIndicator off={not @state.deletionInProgress} /></button>{' '}
        {if @state.deletionError?
          <div className="form-help error">{@state.deletionError.message}</div>}
      </div>
      <div className="column">
        <RouteHandler {...@props} />
      </div>
    </div>

  createNewWorkflow: ->
    @setState creatingWorkflow: true

    workflow = apiClient.type('workflows').create
      display_name: DEFAULT_WORKFLOW_NAME
      primary_language: counterpart.getLocale()
      tasks:
        init:
          type: 'single'
          question: 'Is this the first question?'
          answers: [
            label: 'Yes'
          ]
      first_task: 'init'
      links:
        project: @props.project.id

    @setState
      workflowCreationError: null
      workflowCreationInProgress: true

    workflow.save()
      .catch (error) =>
        @setState workflowCreationError: error
      .then =>
        @props.project.uncacheLink 'workflows'
        @props.project.uncacheLink 'subject_sets' # An "expert" subject set is automatically created with each workflow.
        @setState workflowCreationInProgress: false

  createNewSubjectSet: ->
    subjectSet = apiClient.type('subject_sets').create
      display_name: DEFAULT_SUBJECT_SET_NAME
      links:
        project: @props.project.id

    @setState
      subjectSetCreationError: null
      subjectSetCreationInProgress: true

    subjectSet.save()
      .catch (error) =>
        @setState subjectSetCreationError: error
      .then =>
        @props.project.uncacheLink 'subject_sets'
        @setState subjectSetCreationInProgress: false

  deleteProject: ->
    @setState
      deletionError: null

    confirmed = prompt("""
      You are about to delete this project and all its data!
      Enter #{DELETE_CONFIRMATION_PHRASE} to confirm.
    """) is DELETE_CONFIRMATION_PHRASE

    if confirmed
      @setState
        deletionInProgress: true

      this.props.project.delete()
        .then =>
          @transitionTo 'lab'
        .catch (error) =>
          @setState deletionError: error
        .then =>
          if @isMounted()
            @setState deletionInProgress: false

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
        <EditProjectPage {...@props} project={@state.project} />
      }</ChangeListener>
    else
      <div className="content-container">
        {if @state.rejected.project?
          <code>{@state.rejected.project.toString()}</code>
        else
          <code>Loading</code>}
      </div>
