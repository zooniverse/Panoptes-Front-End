React = require 'react'
apiClient = require '../../api/client'
TitleMixin = require '../../lib/title-mixin'
HandlePropChanges = require '../../lib/handle-prop-changes'
animatedScrollTo = require 'animated-scrollto'
Classifier = require '../../classifier'

classificationsInProgress = {}
upcomingSubjects = {}

module.exports = React.createClass
  displayName: 'ProjectClassifyPage'

  mixins: [TitleMixin, HandlePropChanges]

  title: 'Classify'

  getInitialState: ->
    workflow: null
    subject: null
    classification: null

  propChangeHandlers:
    project: 'loadClassificationForProject'

  componentDidMount: ->
    setTimeout @scrollIntoView

  loadClassificationForProject: (project) ->
    if classificationsInProgress[project.id]?
      @setState classification: classificationsInProgress[project.id]
    else
      @createNewClassification(project).then (classification) =>
        classificationsInProgress[project.id] = classification
        @setState classification: classificationsInProgress[project.id]

  createNewClassification: (project) ->
    project.link('workflows').then (workflows) ->
      randomIndex = Math.floor Math.random() * workflows.length
      workflow = workflows[randomIndex] # TODO: Choose a specific workflow if query exists.

      upcomingSubjects[workflow.id] ?= []

      unless upcomingSubjects[workflow.id].length is 0
        getSubject = Promise.resolve upcomingSubjects[workflow.id].shift()

      if upcomingSubjects[workflow.id].length is 0
        console.log 'Getting more subjects'
        getSubject ?= apiClient.type('subjects').get({
          project_id: project.id
          workflow_id: workflow.id
          # sort: 'cellect'
        }).then (subjects) ->
          upcomingSubjects[workflow.id].push subjects...
          upcomingSubjects[workflow.id].shift()

      getSubject.then (subject) ->
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
    classificationsInProgress[@props.project.id] = null
    @loadClassificationForProject @props.project
