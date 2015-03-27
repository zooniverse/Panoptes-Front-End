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

  mixins: [TitleMixin, Navigation]

  title: ->
    @props.project.display_name

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

    <div className="columns-container content-container">
      <div>
        <ul className="nav-list">
          <li><div className="nav-list-header">Project #{@props.project.id}</div></li>
          <li><Link to="edit-project-details" params={linkParams} className="nav-list-item">Project details</Link></li>
          <li><Link to="edit-project-science-case" params={linkParams} className="nav-list-item">Science case</Link></li>
          <li><Link to="edit-project-results" params={linkParams} className="nav-list-item">Results</Link></li>
          <li><Link to="edit-project-faq" params={linkParams} className="nav-list-item">FAQ</Link></li>
          <li><Link to="edit-project-education" params={linkParams} className="nav-list-item">Education</Link></li>
          <li><Link to="edit-project-collaborators" params={linkParams} className="nav-list-item">Collaborators</Link></li>

          <li>
            <br />
            <div className="nav-list-header">Workflows</div>
            <PromiseRenderer promise={@props.project.get 'workflows'}>{(workflows) =>
              <ul className="nav-list">
                {for workflow in workflows
                  workflowLinkParams = Object.create linkParams
                  workflowLinkParams.workflowID = workflow.id
                  <li key={workflow.id}>
                    <Link to="edit-project-workflow" params={workflowLinkParams} className="nav-list-item">{workflow.display_name}</Link>
                  </li>}
                <li className="nav-list-item">
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
            <br />
            <div className="nav-list-header">Subject sets</div>
            <PromiseRenderer promise={@props.project.get 'subject_sets'}>{(subjectSets) =>
              <ul className="nav-list">
                {for subjectSet in subjectSets
                  subjectSetLinkParams = Object.create linkParams
                  subjectSetLinkParams.subjectSetID = subjectSet.id
                  <li key={subjectSet.id}>
                    <Link to="edit-project-subject-set" params={subjectSetLinkParams} className="nav-list-item">{subjectSet.display_name}</Link>
                  </li>}
                <li className="nav-list-item">
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
        <br />

        <small><button type="button" className="minor-button" disabled={@state.deletionInProgress} onClick={@deleteProject}>Delete this project <LoadingIndicator off={not @state.deletionInProgress} /></button></small>{' '}
        {if @state.deletionError?
          <div className="form-help error">{@state.deletionError.message}</div>}
      </div>

      <hr />

      <div className="column">
        <ChangeListener target={@props.project} handler={=>
          <RouteHandler {...@props} />
        } />
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
      .then =>
        @transitionTo 'edit-project-workflow', projectID: @props.project.id, workflowID: workflow.id
      .catch (error) =>
        @setState workflowCreationError: error
      .then =>
        @props.project.uncacheLink 'workflows'
        @props.project.uncacheLink 'subject_sets' # An "expert" subject set is automatically created with each workflow.
        if @isMounted()
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
      .then =>
        @transitionTo 'edit-project-subject-set', projectID: @props.project.id, subjectSetID: subjectSet.id
      .catch (error) =>
        @setState subjectSetCreationError: error
      .then =>
        @props.project.uncacheLink 'subject_sets'
        if @isMounted()
          @setState subjectSetCreationInProgress: false

  deleteProject: ->
    @setState deletionError: null

    confirmed = prompt("""
      You are about to delete this project and all its data!
      Enter #{DELETE_CONFIRMATION_PHRASE} to confirm.
    """) is DELETE_CONFIRMATION_PHRASE

    if confirmed
      @setState deletionInProgress: true

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

  mixins: [TitleMixin]

  title: 'Edit'

  getDefaultProps: ->
    params:
      projectID: '0'

  render: ->
    getProject = auth.checkCurrent().then =>
      apiClient.type('projects').get @props.params.projectID

    <ChangeListener target={auth} handler={=>
      <PromiseRenderer promise={getProject} pending={=>
        <p className="form-help">Loading project</p>
      } then={(project) =>
        @_project = project
        <EditProjectPage {...@props} project={project} />
      } catch={(error) =>
        <p className="form-help error">{error.toString()}</p>
      } />
    } />
