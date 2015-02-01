React = require 'react'
apiClient = require '../../api/client'
TitleMixin = require '../../lib/title-mixin'
PromiseToSetState = require '../../lib/promise-to-set-state'
Classifier = require '../../classifier'
LoadingIndicator = require '../../components/loading-indicator'

projectStatesInProgress = {}

module.exports = React.createClass
  displayName: 'ClassifyPage'

  mixins: [TitleMixin, PromiseToSetState]

  title: 'Classify'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    workflow: null
    subject: null
    classification: null

  componentDidMount: ->
    @switchToProject @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @switchToProject nextProps.project

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
          set_member_subject: subject.id
      classification.update metadata: ->
        classification.metadata.workflow_version = workflow.version
        classification.metadata
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

  handleClassificationCompletion: ->
    console?.info 'Completed classification', JSON.stringify @state.classification, null, 2
    @state.classification.save().then ->
      console?.log 'Saved classification', @state.classification.id
    # TODO: Preload another subject.

  loadAnotherSubject: ->
    projectStatesInProgress[@props.project.id] = null
    @switchToProject @props.project
