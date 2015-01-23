React = require 'react'
apiClient = require '../../api/client'
PromiseToSetState = require '../../lib/promise-to-set-state'
Classifier = require '../../classifier/classifier'

projectStatesInProgress = {}

module.exports = React.createClass
  displayName: 'ClassifyPage'

  mixins: [PromiseToSetState]

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
    @props.project.attr('workflows').then (workflows) ->
      randomIndex = Math.floor Math.random() * workflows.length
      workflows[index ? randomIndex]

  getSubject: (workflow) ->
    workflow.then (workflow) =>
      apiClient.createType('subjects').get({
        project_id: @props.project.id
        workflow_id: workflow.id
        # sort: 'cellect'
      }, 1).then (subjects) ->
        subjects[Math.floor Math.random() * subjects.length]

  createClassification: (workflow, subject) ->
    Promise.all([workflow, subject]).then ([workflow, subject]) =>
      firstAnnotation = task: workflow.first_task ? Object.keys(workflow.tasks)[0]
      classification = apiClient.createType('classifications').createResource
        annotations: [firstAnnotation]
        links:
          project: @props.project.id
          workflow: workflow.id
          subject: subject.id
      window.classification = classification
      classification

  render: ->
    <div className="classify-content content-container">
      {if @state.workflow?.id and @state.subject?.id and @state.classification?.annotations
        <Classifier
          workflow={@state.workflow}
          subject={@state.subject}
          classification={@state.classification}
          onFinishClassification={@handleFinishingClassification} />
      else
        <div>Loading workflow, subject, and classification</div>}
    </div>

  handleFinishingClassification: (classification) ->
    console?.info 'FINISHED', JSON.stringify classification

    @createNewClassification @props.project
    @promiseToSetState projectStatesInProgress[@props.project.id]
