auth = require 'panoptes-client/lib/auth'
React = require 'react'
ReactDOM = require 'react-dom'
{ Helmet } = require 'react-helmet'
apiClient = require 'panoptes-client/lib/api-client'
counterpart = require 'counterpart'
`import FinishedBanner from './finished-banner';`
Classifier = require '../../classifier'
seenThisSession = require '../../lib/seen-this-session'
`import WorkflowAssignmentDialog from '../../components/workflow-assignment-dialog';`
{ Split } = require('seven-ten')
queryString = require('query-string')

counterpart.registerTranslations 'en',
  classifyPage:
    title: 'Classify'

FAILED_CLASSIFICATION_QUEUE_NAME = 'failed-classifications'

# Map each project ID to a promise of its last randomly-selected workflow ID.
# This is to maintain the same random workflow for each project when none is specified by the user.
currentWorkflowForProject = {}

# Map a workflow ID to a promise of its current classification resource
# This is to maintain the same classification for each workflow.
# In the future user might be able to specify subject sets, which we'll record here similarly.
currentClassifications =
  forWorkflow: {}

# Queue up subjects to classify here.
upcomingSubjects =
  forWorkflow: {}

emptySubjectQueue = ->
  console?.log 'Emptying upcoming subjects queue'
  for workflowID, queue of upcomingSubjects.forWorkflow
    for subject in queue
      subject.destroy()
    queue.splice 0

auth.listen 'change', emptySubjectQueue
apiClient.type('subject_sets').listen 'add-or-remove', emptySubjectQueue

# Store this externally to persist during the session.
sessionDemoMode = false

module.exports = React.createClass
  displayName: 'ProjectTurkClassifyPage'

  contextTypes:
    geordi: React.PropTypes.object

  propTypes:
    loadingSelectedWorkflow: React.PropTypes.bool
    project: React.PropTypes.object
    workflow: React.PropTypes.object
    simulateSaveFailure: React.PropTypes.bool

  getDefaultProps: ->
    loadingSelectedWorkflow: false
    project: null
    workflow: null
    simulateSaveFailure: (location?.search ? '').indexOf('simulate-classification-save-failure') isnt -1

  getInitialState: ->
    subject: null
    classification: null
    projectIsComplete: false
    demoMode: sessionDemoMode
    promptWorkflowAssignmentDialog: false
    rejected: null
    validUserGroup: false

  componentDidMount: () ->
    Split.classifierVisited();
    if @props.workflow and not @props.loadingSelectedWorkflow
      @loadAppropriateClassification(@props)

    @validateUserGroup(@props)

  componentWillUpdate: (nextProps, nextState) ->
    @context.geordi.remember workflowID: nextProps?.workflow?.id

  componentWillUnmount: () ->
    @context.geordi?.forget ['workflowID']

  componentWillReceiveProps: (nextProps) ->
    if @props.project isnt nextProps.project
      @loadAppropriateClassification(nextProps)
    unless nextProps.loadingSelectedWorkflow
      if @props.workflow isnt nextProps.workflow
        # Clear out current classification
        currentClassifications.forWorkflow[@props.workflow?.id] = null
        @setState { classification: null }
        @loadAppropriateClassification(nextProps)
    if nextProps.loadingSelectedWorkflow is false and nextProps.user isnt null
      @shouldWorkflowAssignmentPrompt(nextProps)

    if nextProps.location.query?.group isnt @props.location.query?.group
      @validateUserGroup(nextProps)

  shouldWorkflowAssignmentPrompt: (nextProps) ->
    # Only for Gravity Spy which is assigning workflows to logged in users
    if nextProps.project.experimental_tools.indexOf('workflow assignment') > -1
      assignedWorkflowID = nextProps.preferences?.settings?.workflow_id
      currentWorkflowID = @props.preferences?.preferences.selected_workflow
      if assignedWorkflowID? and currentWorkflowID? and assignedWorkflowID isnt currentWorkflowID
        @setState promptWorkflowAssignmentDialog: true if @state.promptWorkflowAssignmentDialog is false

  loadAppropriateClassification: (props) ->
    # Create a classification if it doesn't exist for the chosen workflow, then resolve our state with it.
    if @state.rejected?.classification?
      @setState rejected: null

    if currentClassifications.forWorkflow[props.workflow.id]
      @setState { classification: currentClassifications.forWorkflow[props.workflow.id] }
    else
      @createNewClassification(props.project, props.workflow)
        .then (classification) =>
          currentClassifications.forWorkflow[props.workflow.id] = classification
          @setState { classification }
        .catch (error) =>
          @setState rejected: { classification: error }

  createNewClassification: (project, workflow) ->
    # A subject set is only specified if the workflow is grouped.
    getSubjectSet = if workflow.grouped
      workflow.get('subject_sets').then (subjectSets) =>
        randomIndex = Math.floor Math.random() * subjectSets.length
        subjectSets[randomIndex]
    else
      Promise.resolve()

    loadSubject = getSubjectSet.then (subjectSet) =>
      @getNextSubject project, workflow, subjectSet

    loadSubject.then (subject) =>
      # console.log 'Creating a new classification'
      classification = apiClient.type('classifications').create
        annotations: []
        metadata:
          workflow_version: workflow.version
          started_at: (new Date).toISOString()
          user_agent: navigator.userAgent
          user_language: counterpart.getLocale()
          utc_offset: ((new Date).getTimezoneOffset() * 60).toString() # In seconds
          subject_dimensions: (null for location in subject.locations)
        links:
          project: project.id
          workflow: workflow.id
          subjects: [subject.id]

      if @state.validUserGroup
        classification.update({ 'metadata.user_group': @props.location.query.group })

      # If the user hasn't interacted with a classification resource before,
      # we won't know how to resolve its links, so attach these manually.
      classification._workflow = workflow
      classification._subjects = [subject]

      classification

  getNextSubject: (project, workflow, subjectSet) ->
    apiClient.get('/subjects/' + @props.location.query.subject_id)
      .then (subjects) =>
        console.log(subjects)
        subjects[0]

  render: ->
    <div className="classify-page content-container">
      <Helmet title="#{@props.project.display_name} » #{counterpart 'classifyPage.title'}" />
      {if @props.projectIsComplete
        <FinishedBanner project={@props.project} />}

      {if @state.validUserGroup
        <p className="anouncement-banner--group">You are classifying as a student of your classroom.</p>}
      {if @state.classification?
        <Classifier
          {...@props}
          classification={@state.classification}
          demoMode={@props.location.query.preview == "true"} # TODO: Actually disable the Done button
          onChangeDemoMode={@handleDemoModeChange}
          onComplete={@saveClassification}
          onCompleteAndLoadAnotherSubject={@saveClassificationAndGoToCallback}
          onClickNext={@goToCallback}
          splits={@props.splits}
        />
      else if @state.rejected?.classification?
        <code>Please try again. Something went wrong: {@state.rejected.classification.toString()}</code>
      else
        <span>Loading classification</span>}
    </div>

  handleDemoModeChange: (newDemoMode) ->
    sessionDemoMode = newDemoMode
    @setState demoMode: sessionDemoMode

  saveClassificationAndGoToCallback: ->
    @saveClassification()
    @goToCallback()

  saveClassification: ->
    @context.geordi?.logEvent type: 'classify'

    classification = @state.classification
    console?.info 'Completed classification', classification

    {workflow, subjects} = classification.links
    seenThisSession.add workflow, subjects
    @queueClassification classification unless @state.demoMode
    @saveAllQueuedClassifications()
    Promise.resolve classification

  queueClassification: (classification) ->
    queue = JSON.parse localStorage.getItem FAILED_CLASSIFICATION_QUEUE_NAME
    queue ?= []
    queue.push classification
    try
      localStorage.setItem FAILED_CLASSIFICATION_QUEUE_NAME, JSON.stringify queue
      console?.info 'Queued classifications:', queue.length
    catch error
      console?.error 'Failed to queue classification:', error

  saveAllQueuedClassifications: ->
    queue = JSON.parse localStorage.getItem FAILED_CLASSIFICATION_QUEUE_NAME
    if queue? and queue.length isnt 0
      console?.log 'Saving queued classifications:', queue.length
      for classificationData in queue then do (classificationData) =>
        apiClient.type('classifications').create(classificationData).save()
          .then (actualClassification) =>
            console?.log 'Saved classification', actualClassification.id
            Split.classificationCreated(actualClassification) # Metric log needs classification id
            # TODO Move this goToCallback()
            callbackUrl = @props.location.query.callback
            query = {classification_id: actualClassification.id}
            window.location = callbackUrl + "?" + queryString.stringify(query)
          .catch (error) =>
            console?.error 'Failed to save a queued classification:', error
            switch error.status
              when 422
                indexInQueue = queue.indexOf classificationData
                queue.splice indexInQueue, 1
                try
                  localStorage.setItem FAILED_CLASSIFICATION_QUEUE_NAME, JSON.stringify queue
                catch error
                  console?.error 'Failed to update classification queue:', error

  goToCallback: ->
    # TODO

  maybePromptWorkflowAssignmentDialog: (props) ->
    if @state.promptWorkflowAssignmentDialog
      WorkflowAssignmentDialog.start({splits: props.splits})
        .then =>
          @setState { promptWorkflowAssignmentDialog: false }
        .then =>
          if props.preferences.selected_workflow isnt props.preferences.settings.workflow_id
            props.preferences.update
              'preferences.selected_workflow': props.preferences.settings.workflow_id
            props.preferences.save()

  validateUserGroup: (props) ->
    if props.location.query?.group? and props.user?
      apiClient.type('user_groups').get(props.location.query.group).then (group) =>
        @setState({ validUserGroup: group and group.links.users.includes(props.user.id) })

# For debugging:
window.currentWorkflowForProject = currentWorkflowForProject
window.currentClassifications = currentClassifications
window.upcomingSubjects = upcomingSubjects
