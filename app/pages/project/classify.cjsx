React = require 'react'
apiClient = require '../../api/client'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
animatedScrollTo = require 'animated-scrollto'
Classifier = require '../../classifier'

SKIP_CELLECT = location.search.match(/\Wcellect=0(?:\W|$)/)?

if SKIP_CELLECT
  console?.warn 'Intelligent subject selection disabled'

classificationsInProgress =
  byProject: {}
  byWorkflow: {}

upcomingSubjects =
  byWorkflow: {}

module.exports = React.createClass
  displayName: 'ProjectClassifyPage'

  mixins: [TitleMixin, HandlePropChanges]

  title: 'Classify'

  getInitialState: ->
    target: {}
    workflow: null
    subject: null
    classification: null

  propChangeHandlers:
    project: (project) ->
      @setTarget {project}

    'query.workflow': (workflowID) ->
      @setTarget {workflowID}

  setTarget: (newTarget) ->
    for key, value of newTarget
      @state.target[key] = value
    @loadClassification()

  loadClassification: ->
    {project, workflowID} = @state.target

    if workflowID?
      [from, id] = ['byWorkflow', workflowID]
    else
      [from, id] = ['byProject', project.id]

    if classificationsInProgress[from][id]?
      @setState classification: classificationsInProgress[from][id]
    else
      @createNewClassification().then (classification) =>
        classificationsInProgress[from][id] = classification
        @setState classification: classificationsInProgress[from][id]

  createNewClassification: (project) ->
    {project, workflowID} = @state.target

    getWorkflow = project.link('workflows').then (workflows) ->
      if workflows.length is 0
        throw new Error "Project has no workflows."
      else if workflowID?
        workflow = (workflow for workflow in workflows when workflow.id is workflowID)[0]
        unless workflow?
          throw new Error "Could not find workflow #{workflowID}"
        workflow
      else
        randomIndex = Math.floor Math.random() * workflows.length
        workflows[randomIndex]

    getSubject = getWorkflow.then (workflow) ->
      upcomingSubjects.byWorkflow[workflow.id] ?= []

      unless upcomingSubjects.byWorkflow[workflow.id].length is 0
        subject = upcomingSubjects.byWorkflow[workflow.id].shift()

      if upcomingSubjects.byWorkflow[workflow.id].length is 0
        fetchSubjects = apiClient.type('subjects').get({
          project_id: project.id
          workflow_id: workflow.id
          sort: 'cellect' unless SKIP_CELLECT
        }).then (subjects) ->
          upcomingSubjects.byWorkflow[workflow.id].push subjects...

        subject ?= fetchSubjects.then ->
          if upcomingSubjects.byWorkflow[workflow.id].length is 0
            # TODO: If this fails during a random workflow, pick the next workflow.
            throw new Error 'No more subjects'
          else
            upcomingSubjects.byWorkflow[workflow.id].shift()

      subject

    Promise.all([getWorkflow, getSubject]).then ([workflow, subject]) ->
      classification = apiClient.type('classifications').create
        links:
          project: project.id
          workflow: workflow.id
          subjects: [subject.id]

      classification.metadata.workflow_version = workflow.version
      classification.update 'metadata'

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
    classificationsInProgress.byProject[@props.project.id] = null
    @loadClassification 'byProject', @props.project
