React = require 'react'
apiClient = require '../../api/client'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
PromiseToSetState = require '../../lib/promise-to-set-state'
animatedScrollTo = require 'animated-scrollto'
Classifier = require '../../classifier'

SKIP_CELLECT = location.search.match(/\Wcellect=0(?:\W|$)/)?

if SKIP_CELLECT
  console?.warn 'Intelligent subject selection disabled'

window.currentWorkflowForProject = {} # Project ID to promised workflow ID, used when no workflow is specified

window.currentClassifications =
  forWorkflow: {} # Workflow ID to a promise for its current classification resource

window.upcomingSubjects =
  forWorkflow: {}

module.exports = React.createClass
  displayName: 'ProjectClassifyPage'

  mixins: [TitleMixin, HandlePropChanges, PromiseToSetState]

  title: 'Classify'

  getInitialState: ->
    workflow: null
    subject: null
    classification: null

  propChangeHandlers:
    project: 'loadClassification'
    query: 'loadClassification'

  loadClassification: (_, props = @props) ->
    console.log 'Loading classification!'
    getWorkflowID = if props.query?.workflow?
      Promise.resolve props.query.workflow
    else
      console.log 'Workflow for project', currentWorkflowForProject[props.project.id]
      currentWorkflowForProject[props.project.id] ?= @getRandomWorkflowID props.project
      currentWorkflowForProject[props.project.id]

    @promiseToSetState classification: getWorkflowID.then (workflowID) =>
      console.log 'Classification for workflow', currentClassifications.forWorkflow[workflowID]
      currentClassifications.forWorkflow[workflowID] ?= @createNewClassification props.project, workflowID
      currentClassifications.forWorkflow[workflowID]

  getRandomWorkflowID: (project) ->
    project.get('workflows').then (workflows) ->
      if workflows.length is 0
        throw new Error "No workflows for project #{project.id}"
      else
        randomIndex = Math.floor Math.random() * workflows.length
        workflows[randomIndex].id

  createNewClassification: (project, workflowID) ->
    console.log 'createNewClassification()', arguments
    getWorkflow = project.get('workflows').then (workflows) ->
      workflow = (workflow for workflow in workflows when workflow.id is workflowID)[0]
      unless workflow?
        throw new Error "No workflow #{workflowID} for project #{project.id}"
      console.log 'Got workflow', workflow
      workflow

    getSubject = getWorkflow.then (workflow) ->
      upcomingSubjects.forWorkflow[workflow.id] ?= []

      unless upcomingSubjects.forWorkflow[workflow.id].length is 0
        subject = upcomingSubjects.forWorkflow[workflow.id].shift()

      if upcomingSubjects.forWorkflow[workflow.id].length is 0
        fetchSubjects = apiClient.type('subjects').get({
          project_id: project.id
          workflow_id: workflow.id
          sort: 'cellect' unless SKIP_CELLECT
        }).then (subjects) ->
          upcomingSubjects.forWorkflow[workflow.id].push subjects...

        subject ?= fetchSubjects.then ->
          if upcomingSubjects.forWorkflow[workflow.id].length is 0
            # TODO: If this fails during a random workflow, pick the next workflow.
            throw new Error 'No more subjects'
          else
            upcomingSubjects.forWorkflow[workflow.id].shift()

      console.log 'Got subject', subject
      subject

    Promise.all([getWorkflow, getSubject]).then ([workflow, subject]) ->
      console.log 'Creating classification'
      classification = apiClient.type('classifications').create
        links:
          project: project.id
          workflow: workflow.id
          subjects: [subject.id]
        'metadata.workflow_version': workflow.version

      # TODO: This is temporary.
      # Don't rely on these once the back end provides the right links.
      classification._workflow = workflow
      classification._subject = subject

      # TODO: This should be handled by the classifier.
      classification.annotate workflow.tasks[workflow.first_task].type, workflow.first_task
      classification

  render: ->
    <div className="classify-page content-container">
      {if @state.classification?
        <Classifier
          classification={@state.classification}
          onLoad={@scrollIntoView}
          onComplete={@handleClassificationCompletion}
          onClickNext={@loadAnotherSubject} />
      else if @state.rejected.classification?
        <code>{@state.rejected.classification.toString()}</code>
      else
        <span>Loading classification</span>}
    </div>

  scrollIntoView: (e) ->
    lineHeight = parseFloat getComputedStyle(document.body).lineHeight
    el = @getDOMNode()
    space = (innerHeight - el.offsetHeight) / 2
    idealScrollY = el.offsetTop - space
    if Math.abs(idealScrollY - scrollY) > lineHeight
      animatedScrollTo document.body, el.offsetTop - space, 333

  handleClassificationCompletion: ->
    console?.info 'Completed classification', JSON.stringify @state.classification, null, 2
    @state.classification.save().then =>
      console?.log 'Saved classification', @state.classification.id

  loadAnotherSubject: ->
    currentWorkflowForProject[@props.project.id].then (workflowID) =>
      currentClassifications.forWorkflow[workflowID] = null
      currentWorkflowForProject[@props.project.id] = null
    @loadClassification()
