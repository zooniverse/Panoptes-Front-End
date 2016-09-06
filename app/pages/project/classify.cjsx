auth = require 'panoptes-client/lib/auth'
React = require 'react'
ReactDOM = require 'react-dom'
TitleMixin = require '../../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
counterpart = require 'counterpart'
FinishedBanner = require './finished-banner'
Classifier = require '../../classifier'
seenThisSession = require '../../lib/seen-this-session'
MiniCourse = require '../../lib/mini-course'
`import CustomSignInPrompt from './custom-sign-in-prompt'`
`import WorkflowAssignmentDialog from '../../components/workflow-assignment-dialog'`

FAILED_CLASSIFICATION_QUEUE_NAME = 'failed-classifications'

PROMPT_MINI_COURSE_EVERY = 5

SKIP_CELLECT = location?.search.match(/\Wcellect=0(?:\W|$)/)?

if SKIP_CELLECT
  console?.warn 'Intelligent subject selection disabled'

# Classification count tracked for mini-course prompt
classificationsThisSession = 0

auth.listen ->
  classificationsThisSession = 0

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
  displayName: 'ProjectClassifyPage'

  mixins: [TitleMixin]

  title: 'Classify'

  contextTypes:
    geordi: React.PropTypes.object

  getDefaultProps: ->
    query: null
    project: null
    selectedWorkflow: null
    simulateSaveFailure: (location?.search ? '').indexOf('simulate-classification-save-failure') isnt -1

  getInitialState: ->
    subject: null
    classification: null
    projectIsComplete: false
    demoMode: sessionDemoMode
    promptWorkflowAssignmentDialog: false
    rejected: null

  # propChangeHandlers:
  #   project: 'loadAppropriateClassification'
  #   query: 'loadAppropriateClassification'

  componentDidMount: () ->
    if @props.selectedWorkflow?
      @loadAppropriateClassification(@props)

  componentWillUpdate: (nextProps, nextState) ->
    @context.geordi.remember workflowID: nextProps?.selectedWorkflow?.id

  componentWillUnmount: () ->
    @context.geordi?.forget ['workflowID']

  componentWillReceiveProps: (nextProps) ->
    @shouldWorkflowAssignmentPrompt(nextProps.preferences)
    if @props.project isnt nextProps.project
      @loadAppropriateClassification(nextProps)
    if @props.selectedWorkflow? and @props.selectedWorkflow isnt nextProps.selectedWorkflow
      @loadAppropriateClassification(nextProps)

  shouldWorkflowAssignmentPrompt: (preferences) ->
    # Only for Gravity Spy which is assigning workflows to logged in users
    assignedWorkflowID = preferences?.settings?.workflow_id
    if @props.project.experimental_tools.indexOf('workflow assignment') > -1 and @props.user?
      if assignedWorkflowID? and assignedWorkflowID isnt @props.selectedWorkflow?.id
        @setState promptWorkflowAssignmentDialog: true if @state.promptWorkflowAssignmentDialog is false

  loadAppropriateClassification: (props) ->
    # To load the right classification, we'll need to know which workflow the user expects.
    # console.log 'Loading appropriate classification'
      # console.log 'Loading classification for workflow', workflow.id
      # Create a classification if it doesn't exist for the chosen workflow, then resolve our state with it.
    if @state.rejected?.classification?
      @setState rejected: null

    awaitClassification = Promise.resolve(
      currentClassifications.forWorkflow[props.selectedWorkflow.id] ?= @createNewClassification props.project, props.selectedWorkflow
    ).catch (error) =>
      @setState rejected: { classification: error }

    awaitClassification.then (classification) =>
      @setState { classification }

  # getCurrentWorkflow: (props) ->
  #   if props.location.query?.workflow?
  #     # console.log 'Workflow specified as', props.location.query.workflow
  #     # Prefer the workflow specified in the query.
  #     @getWorkflow props.project, props.location.query.workflow
  #   else if props.selectedWorkflow?.id?
  #     # Select the selected workflow if user navigates directly to the classify page
  #     @getWorkflow props.project, props.selectedWorkflow.id
  #   else
  #     # If no workflow is specified, pick a random one and record it for later.
  #     # When we send this classification, we'll clear this value to select a new random workflow.
  #     currentWorkflowForProject[props.project.id] ?= @getRandomWorkflow props.project
  #     currentWorkflowForProject[props.project.id]

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

      # If the user hasn't interacted with a classification resource before,
      # we won't know how to resolve its links, so attach these manually.
      classification._workflow = workflow
      classification._subjects = [subject]

      classification

  # getWorkflow: (project, workflowID) ->
  #   # console.log 'Getting workflow', workflowID
  #   # We could just get the workflow directly, but this way we ensure the workflow belongs to the project.
  #   project.get('workflows', id: workflowID).then ([workflow]) ->
  #     unless workflow?
  #       throw new Error "No workflow #{workflowID} for project #{project.id}"
  #     workflow

  getNextSubject: (project, workflow, subjectSet) ->
    # console.log 'Getting next subject for', workflow.id
    # Make sure a list of subjects exists for this workflow.
    upcomingSubjects.forWorkflow[workflow.id] ?= []

    # Take the next subject in the list, if there are any.
    unless upcomingSubjects.forWorkflow[workflow.id].length is 0
      subjectToLoad = upcomingSubjects.forWorkflow[workflow.id].shift()
      subject = Promise.resolve subjectToLoad

    # If there aren't any left (or there weren't any to begin with), refill the list.
    if upcomingSubjects.forWorkflow[workflow.id].length is 0
      # console.log 'Fetching subjects'
      @maybePromptWorkflowAssignmentDialog()
      subjectQuery =
        workflow_id: workflow.id
        sort: 'queued' unless SKIP_CELLECT
      if subjectSet?
        subjectQuery.subject_set_id = subjectSet.id

      fetchSubjects = apiClient.type('subjects').get subjectQuery
        .catch (error) ->
          if error.message.indexOf('please try again') is -1
            throw error
          else
            new Promise (resolve, reject) ->
              fetchSubjectsAgain = ->
                apiClient.type('subjects').get subjectQuery
                  .then resolve
                  .catch reject
              setTimeout fetchSubjectsAgain, 2000
        .then (subjects) ->
          nonLoadedSubjects = (newSubject for newSubject in subjects when newSubject isnt subjectToLoad)
          upcomingSubjects.forWorkflow[workflow.id].push nonLoadedSubjects...

      # If we're filling this list for the first time, we won't have a subject selected, so try again.
      subject ?= fetchSubjects.then ->
        if upcomingSubjects.forWorkflow[workflow.id].length is 0
          # TODO: If this fails during a random workflow, pick the next workflow.
          throw new Error "No subjects available for workflow #{workflow.id}"
        else
          upcomingSubjects.forWorkflow[workflow.id].shift()

      # TODO: Pre-load images for the next subject.

    # console.log 'Chose a subject'
    subject

  render: ->
    <div className="classify-page content-container">
      {if @props.projectIsComplete
        <FinishedBanner project={@props.project} />}

      {if @props.project.experimental_tools.indexOf('workflow assignment') > -1 and not @props.user # Gravity Spy
        <CustomSignInPrompt classificationsThisSession={classificationsThisSession}> 
          <p>Please sign in or sign up to access more glitch types and classification options as well as our mini-course.</p>
        </CustomSignInPrompt>}
      {if @state.classification?
        <Classifier
          {...@props}
          classification={@state.classification}
          demoMode={@state.demoMode}
          onChangeDemoMode={@handleDemoModeChange}
          onComplete={@saveClassification}
          onCompleteAndLoadAnotherSubject={@saveClassificationAndLoadAnotherSubject}
          onClickNext={@loadAnotherSubject}
        />
      else if @state.rejected?.classification?
        <code>{@state.rejected.classification.toString()}</code>
      else
        <span>Loading classification</span>}
    </div>

  handleDemoModeChange: (newDemoMode) ->
    sessionDemoMode = newDemoMode
    @setState demoMode: sessionDemoMode

  saveClassificationAndLoadAnotherSubject: ->
    @saveClassification()
      .then @loadAnotherSubject()

  saveClassification: ->
    @context.geordi?.logEvent type: 'classify'
    classification = @state.classification
    console?.info 'Completed classification', classification
    savingClassification = if @state.demoMode
      Promise.resolve classification
    else if @props.simulateSaveFailure
      Promise.reject new Error 'Simulated failure of classification save'
    else
      classification.save()

    savingClassification
      .then (classification) =>
        if @state.demoMode
          console?.log 'Demo mode: Did NOT save classification'
        else
          console?.log 'Saved classification', classification.id
          Promise.all([
            classification.get 'workflow'
            classification.get 'subjects'
          ]).then ([workflow, subjects]) ->
            seenThisSession.add workflow, subjects
            classification.destroy()
        @saveAllQueuedClassifications()
      .catch (error) =>
        console?.warn 'Failed to save classification:', error
        @queueClassification classification

      classificationsThisSession += 1
      @maybeLaunchMiniCourse()

    return savingClassification

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
            actualClassification.destroy()
            indexInQueue = queue.indexOf classificationData
            queue.splice indexInQueue, 1
            try
              localStorage.setItem FAILED_CLASSIFICATION_QUEUE_NAME, JSON.stringify queue
              console?.info 'Saved a queued classification, remaining:', queue.length
            catch error
              console?.error 'Failed to update classification queue:', error
          .catch (error) =>
            console?.error 'Failed to save a queued classification:', error

  loadAnotherSubject: ->
    # @getCurrentWorkflow(@props).then (workflow) =>
      # Forget the old classification so a new one will load.
    currentClassifications.forWorkflow[@props.selectedWorkflow.id] = null
      # Forget the old workflow, unless it was specified, so we'll get a random one next time.
      # unless @props.location.query?.workflow?
      #   currentWorkflowForProject[@props.project.id] = null
    @loadAppropriateClassification(@props) if @props.selectedWorkflow?

  maybeLaunchMiniCourse: ->
    if classificationsThisSession % PROMPT_MINI_COURSE_EVERY is 0
      MiniCourse.startIfNecessary({
        workflow: @props.selectedWorkflow,
        preferences: @props.preferences,
        project: @props.project,
        user: @props.user
      })

  maybePromptWorkflowAssignmentDialog: (nextWorkflow) ->
    if @state.promptWorkflowAssignmentDialog
      WorkflowAssignmentDialog.start(@props.history, @props.location, @props.preferences)
        .then =>
          @loadAnotherSubject()

          if @props.selectedWorkflow.id isnt @props.preferences.preferences.selected_workflow
            @props.preferences.save()
              .then =>
                @setState promptWorkflowAssignmentDialog: false
          else
            @setState promptWorkflowAssignmentDialog: false

               
# For debugging:
window.currentWorkflowForProject = currentWorkflowForProject
window.currentClassifications = currentClassifications
window.upcomingSubjects = upcomingSubjects
