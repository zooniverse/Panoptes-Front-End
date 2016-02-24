auth = require 'panoptes-client/lib/auth'
React = require 'react'
ReactDOM = require 'react-dom'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
PromiseToSetState = require '../../lib/promise-to-set-state'
apiClient = require 'panoptes-client/lib/api-client'
animatedScrollTo = require 'animated-scrollto'
counterpart = require 'counterpart'
FinishedBanner = require './finished-banner'
Classifier = require '../../classifier'
alert = require '../../lib/alert'
SignInPrompt = require '../../partials/sign-in-prompt'
seenThisSession = require '../../lib/seen-this-session'

FAILED_CLASSIFICATION_QUEUE_NAME = 'failed-classifications'

PROMPT_TO_SIGN_IN_AFTER = [5, 10, 25, 50, 100, 250, 500]

SKIP_CELLECT = location?.search.match(/\Wcellect=0(?:\W|$)/)?

if SKIP_CELLECT
  console?.warn 'Intelligent subject selection disabled'

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

  mixins: [TitleMixin, HandlePropChanges, PromiseToSetState]

  title: 'Classify'

  getDefaultProps: ->
    query: null
    project: null
    simulateSaveFailure: (location?.search ? '').indexOf('simulate-classification-save-failure') isnt -1

  getInitialState: ->
    workflow: null
    subject: null
    classification: null
    projectIsComplete: false
    demoMode: sessionDemoMode

  propChangeHandlers:
    project: 'loadAppropriateClassification'
    query: 'loadAppropriateClassification'

  componentDidMount: () ->
    @getCurrentWorkflow().then (workflow) =>
      @setState {workflow}

  loadAppropriateClassification: (_, props = @props) ->
    # To load the right classification, we'll need to know which workflow the user expects.
    # console.log 'Loading appropriate classification'
    @promiseToSetState classification: @getCurrentWorkflow(props).then (workflow) =>
      # console.log 'Loading classification for workflow', workflow.id
      # Create a classification if it doesn't exist for the chosen workflow, then resolve our state with it.
      currentClassifications.forWorkflow[workflow.id] ?= @createNewClassification props.project, workflow
      currentClassifications.forWorkflow[workflow.id]

  getCurrentWorkflow: (props = @props) ->
    if props.location.query?.workflow?
      # console.log 'Workflow specified as', props.query.workflow
      # Prefer the workflow specified in the query.
      @getWorkflow props.project, props.location.query.workflow
    else
      # If no workflow is specified, pick a random one and record it for later.
      # When we send this classification, we'll clear this value to select a new random workflow.
      currentWorkflowForProject[props.project.id] ?= @getRandomWorkflow props.project
      currentWorkflowForProject[props.project.id]

  getRandomWorkflow: (project) ->
    project.get('workflows', active: true).then (workflows) =>
      if workflows.length is 0
        throw new Error "No workflows for project #{project.id}"
        project.uncacheLink 'workflows'
      else
        projectIsComplete = (true for workflow in workflows when not workflow.finished_at?).length is 0
        @setState {projectIsComplete}
        randomIndex = Math.floor Math.random() * workflows.length
        # console.log 'Chose random workflow', workflows[randomIndex].id
        workflows[randomIndex]

  createNewClassification: (project, workflow) ->
    @setState {workflow}
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

  getWorkflow: (project, workflowID) ->
    # console.log 'Getting workflow', workflowID
    # We could just get the workflow directly, but this way we ensure the workflow belongs to the project.
    project.get('workflows', id: workflowID).then ([workflow]) ->
      unless workflow?
        throw new Error "No workflow #{workflowID} for project #{project.id}"
      workflow

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
      {if @state.projectIsComplete
        <FinishedBanner project={@props.project} />}

      {if @state.classification?
        <Classifier
          {...@props}
          classification={@state.classification}
          onLoad={@scrollIntoView}
          demoMode={@state.demoMode}
          onChangeDemoMode={@handleDemoModeChange}
          onComplete={if @state.workflow?.configuration?.hide_classification_summaries then @saveClassificationAndLoadAnotherSubject else @saveClassification}
          onClickNext={@loadAnotherSubject}
        />
      else if @state.rejected.classification?
        <code>{@state.rejected.classification.toString()}</code>
      else
        <span>Loading classification</span>}
    </div>

  scrollIntoView: (e) ->
    # Auto-scroll to the middle of the classification interface on load.
    # It's not perfect, but it should make the location of everything more obvious.
    lineHeight = parseFloat getComputedStyle(document.body).lineHeight
    node = ReactDOM.findDOMNode(@)
    space = (innerHeight - node.offsetHeight) / 2
    idealScrollY = node.offsetTop - space
    if Math.abs(idealScrollY - scrollY) > lineHeight
      animatedScrollTo document.body, node.offsetTop - space, 333

  handleDemoModeChange: (newDemoMode) ->
    sessionDemoMode = newDemoMode
    @setState demoMode: sessionDemoMode

  saveClassificationAndLoadAnotherSubject: ->
    @saveClassification()
      .then @loadAnotherSubject()

  saveClassification: ->
    console?.info 'Completed classification', @state.classification
    savingClassification = if @state.demoMode
      Promise.resolve @state.classification
    else if @props.simulateSaveFailure
      Promise.reject new Error 'Simulated failure of classification save'
    else
      @state.classification.save()

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
        @queueClassification @state.classification

      classificationsThisSession += 1
      @maybePromptToSignIn()

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

  maybePromptToSignIn: ->
    if classificationsThisSession in PROMPT_TO_SIGN_IN_AFTER and not @props.user?
      alert (resolve) =>
        <SignInPrompt project={@props.project} onChoose={resolve}>
          <p><strong>You’ve done {classificationsThisSession} classifications, but you’re not signed in!</strong></p>
        </SignInPrompt>

  loadAnotherSubject: ->
    @getCurrentWorkflow(@props).then (workflow) =>
      # Forget the old classification so a new one will load.
      currentClassifications.forWorkflow[workflow.id] = null
      # Forget the old workflow, unless it was specified, so we'll get a random one next time.
      unless @props.location.query?.workflow?
        currentWorkflowForProject[@props.project.id] = null
      @loadAppropriateClassification()

# For debugging:
window.currentWorkflowForProject = currentWorkflowForProject
window.currentClassifications = currentClassifications
window.upcomingSubjects = upcomingSubjects
