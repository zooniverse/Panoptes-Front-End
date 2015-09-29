auth = require '../../api/auth'
React = require 'react'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
PromiseToSetState = require '../../lib/promise-to-set-state'
apiClient = require '../../api/client'
animatedScrollTo = require 'animated-scrollto'
counterpart = require 'counterpart'
Classifier = require '../../classifier'
alert = require '../../lib/alert'
SignInPrompt = require '../../partials/sign-in-prompt'
seenThisSession = require '../../lib/seen-this-session'

PROMPT_TO_SIGN_IN_AFTER = [5, 10, 25, 50, 100, 250, 500]

SKIP_CELLECT = location.search.match(/\Wcellect=0(?:\W|$)/)?

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

module.exports = React.createClass
  displayName: 'ProjectClassifyPage'

  mixins: [TitleMixin, HandlePropChanges, PromiseToSetState]

  title: 'Classify'

  getDefaultProps: ->
    query: null
    project: null

  getInitialState: ->
    workflow: null
    subject: null
    classification: null
    newClassificationsAreGoldStandard: false
    newClassificationsAreThrowaway: false

  propChangeHandlers:
    project: 'loadAppropriateClassification'
    query: 'loadAppropriateClassification'

  loadAppropriateClassification: (_, props = @props) ->
    # To load the right classification, we'll need to know which workflow the user expects.
    # console.log 'Loading appropriate classification'
    @promiseToSetState classification: @getCurrentWorkflowID(props).then (workflowID) =>
      # console.log 'Loading classification for workflow', workflowID
      # Create a classification if it doesn't exist for the chosen workflow, then resolve our state with it.
      currentClassifications.forWorkflow[workflowID] ?= @createNewClassification props.project, workflowID
      currentClassifications.forWorkflow[workflowID]

  getCurrentWorkflowID: (props = @props) ->
    getWorkflowID = if props.query?.workflow?
      # console.log 'Workflow specified as', props.query.workflow
      # Prefer the workflow specified in the query.
      Promise.resolve props.query.workflow
    else
      # If no workflow is specified, pick a random one and record it for later.
      # When we send this classification, we'll clear this value to select a new random workflow.
      currentWorkflowForProject[props.project.id] ?= @getRandomWorkflowID props.project
      currentWorkflowForProject[props.project.id]

  getRandomWorkflowID: (project) ->
    project.get('workflows', active: true).then (workflows) ->
      if workflows.length is 0
        throw new Error "No workflows for project #{project.id}"
        project.uncacheLink 'workflows'
      else
        randomIndex = Math.floor Math.random() * workflows.length
        # console.log 'Chose random workflow', workflows[randomIndex].id
        workflows[randomIndex].id

  createNewClassification: (project, workflowID) ->
    workflow = @getWorkflow project, workflowID
    subject = workflow.then (workflow) =>
      # A subject set is only specified if the workflow is grouped.
      getSubjectSet = if workflow.grouped
        workflow.get('subject_sets').then (subjectSets) =>
          randomIndex = Math.floor Math.random() * subjectSets.length
          subjectSets[randomIndex]
      else
        Promise.resolve()

      getSubjectSet.then (subjectSet) =>
        @getNextSubject project, workflow, subjectSet

    Promise.all([workflow, subject]).then ([workflow, subject]) =>
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
          gold_standard: @state.newClassificationsAreGoldStandard
          throwaway: @state.newClassificationsAreThrowaway
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
    project.get('workflows').then (workflows) ->
      workflow = (workflow for workflow in workflows when workflow.id is workflowID)[0]
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
      {if @state.classification?
        <Classifier
          {...@props}
          classification={@state.classification}
          onLoad={@scrollIntoView}
          onComplete={@saveClassification}
          onClickNext={@loadAnotherSubject}
          onChangeExpertOptions={@handleExpertOptionsChange}
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
    el = @getDOMNode()
    space = (innerHeight - el.offsetHeight) / 2
    idealScrollY = el.offsetTop - space
    if Math.abs(idealScrollY - scrollY) > lineHeight
      animatedScrollTo document.body, el.offsetTop - space, 333

  saveClassification: ->
    console?.info 'Completed classification', @state.classification
    @state.classification.save().then (classification) =>
      console?.log 'Saved classification', classification.id
      Promise.all([
        classification.get 'workflow'
        classification.get 'subjects'
      ]).then ([workflow, subjects]) ->
        seenThisSession.add workflow, subjects
        classification.destroy()
      classificationsThisSession += 1
      @maybePromptToSignIn()

  handleExpertOptionsChange: (options) ->
    @setState options

  maybePromptToSignIn: ->
    if classificationsThisSession in PROMPT_TO_SIGN_IN_AFTER and not @props.user?
      alert (resolve) =>
        <SignInPrompt project={@props.project} onChoose={resolve}>
          <p><strong>You’ve done {classificationsThisSession} classifications, but you’re not signed in!</strong></p>
        </SignInPrompt>

  loadAnotherSubject: ->
    @getCurrentWorkflowID(@props).then (workflowID) =>
      # Forget the old classification so a new one will load.
      currentClassifications.forWorkflow[workflowID] = null
      # Forget the old workflow, unless it was specified, so we'll get a random one next time.
      unless @props.query?.workflow?
        currentWorkflowForProject[@props.project.id] = null
      @loadAppropriateClassification()

# For debugging:
window.currentWorkflowForProject = currentWorkflowForProject
window.currentClassifications = currentClassifications
window.upcomingSubjects = upcomingSubjects
