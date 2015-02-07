React = require 'react'
apiClient = require '../../api/client'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
animatedScrollTo = require 'animated-scrollto'
PromiseToSetState = require '../../lib/promise-to-set-state'
Classifier = require '../../classifier'
LoadingIndicator = require '../../components/loading-indicator'

projectStatesInProgress = {}

module.exports = React.createClass
  displayName: 'ProjectClassifyPage'

  mixins: [TitleMixin, HandlePropChanges, PromiseToSetState]

  title: 'Classify'

  getInitialState: ->
    workflow: null
    subject: null
    classification: null

  propChangeHandlers:
    project: 'switchToProject'

  componentDidMount: ->
    setTimeout @autoScroll

  switchToProject: (project) ->
    unless projectStatesInProgress[project.id]?
      @createNewClassification project
    @promiseToSetState projectStatesInProgress[project.id]

  createNewClassification: (project) ->
    workflow = @getWorkflow()
    subject = @getSubject workflow
    classification = @createClassification workflow, subject
    projectStatesInProgress[project.id] = {workflow, subject, classification}

  getWorkflow: (index) ->
    @props.project.link('workflows').then (workflows) ->
      randomIndex = Math.floor Math.random() * workflows.length
      workflows[index ? randomIndex]

  getSubject: (workflow) ->
    workflow.then (workflow) =>
      apiClient.type('subjects').get({
        project_id: @props.project.id
        workflow_id: workflow.id
        # sort: 'cellect'
      }, 1).then (subjects) ->
        subjects[Math.floor Math.random() * subjects.length]

  createClassification: (workflow, subject) ->
    Promise.all([workflow, subject]).then ([workflow, subject]) =>
      classification = apiClient.type('classifications').create
        links:
          project: @props.project.id
          workflow: workflow.id
          subjects: [subject.id]
      classification.metadata.workflow_version = workflow.version
      classification.update 'metadata'
      classification.annotate workflow.tasks[workflow.first_task].type, workflow.first_task
      window.classification = classification
      classification

  render: ->
    <div className="classify-content content-container">
      {if @state.workflow? and @state.subject? and @state.classification?
        <Classifier
          workflow={@state.workflow}
          subject={@state.subject}
          classification={@state.classification}
          loading={@state.pending.subject?}
          onComplete={@handleClassificationCompletion}
          onClickNext={@loadAnotherSubject} />
      else
        <span><LoadingIndicator /> Loading classification interface</span>}
    </div>

  autoScroll: ->
    # TODO: Call this on first subject load?
    if scrollY is 0
      el = @getDOMNode()
      space = (innerHeight - el.offsetHeight) / 2
      animatedScrollTo document.body, el.offsetTop - space, 500

  handleClassificationCompletion: ->
    console?.info 'Completed classification', JSON.stringify @state.classification, null, 2
    @state.classification.save().then =>
      console?.log 'Saved classification', @state.classification.id
    # TODO: Preload another subject.

  loadAnotherSubject: ->
    projectStatesInProgress[@props.project.id] = null
    @switchToProject @props.project
