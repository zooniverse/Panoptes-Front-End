React = require 'react'
HandlePropChanges = require '../lib/handle-prop-changes'
ChangeListener = require '../components/change-listener'
SubjectViewer = require './subject-viewer'
ClassificationSummary = require './classification-summary'
tasks = require './tasks'
{Link} = require 'react-router'
drawingTools = require './drawing-tools'

NOOP = Function.prototype

unless process.env.NODE_ENV is 'production'
  mockData = require './mock-data'

Classifier = React.createClass
  displayName: 'Classifier'

  mixins: [HandlePropChanges]

  _lastAnnotationAndTool: ''

  getDefaultProps: ->
    unless process.env.NODE_ENV is 'production'
      {workflow, subject, classification} = mockData
    workflow: workflow
    subject: subject
    classification: classification
    onLoad: NOOP

  propChangeHandlers:
    subject: ->
      @setState subjectLoading: true
    classification: (classification) ->
      window.classification = classification
      setTimeout =>
        classification.annotations ?= []
        if classification.annotations.length is 0
          @addAnnotationForTask @props.workflow.first_task

  getInitialState: ->
    subjectLoading: false
    showingExpertClassification: false
    selectedExpertAnnotation: -1

  render: ->
    <ChangeListener target={@props.classification}>{=>
      currentClassification = if @state.showingExpertClassification
        @props.subject.expert_classification_data
      else
        @props.classification

      if currentClassification is @props.classification and not @props.classification.completed
        currentAnnotation = currentClassification.annotations[currentClassification.annotations.length - 1]
        currentTask = @props.workflow.tasks[currentAnnotation?.task]

      <div className="classifier">
        <SubjectViewer user={@props.user} project={@props.project} subject={@props.subject} workflow={@props.workflow} classification={currentClassification} annotation={currentAnnotation} onLoad={@handleSubjectImageLoad} />

        <div className="task-area">
          {if currentTask?
            TaskComponent = tasks[currentTask.type]

            onFirstAnnotation = currentClassification.annotations.indexOf(currentAnnotation) is 0

            switch currentTask.type
              when 'single'
                currentAnswer = currentTask.answers?[currentAnnotation.value]
                waitingForAnswer = currentTask.required and not currentAnswer
              when 'multiple'
                waitingForAnswer = currentTask.required and currentAnnotation.value.length is 0

            # If the next task key exists, make sure the task it points to actually exists.
            nextTaskKey = if currentTask.type is 'single' and currentAnswer? and @props.workflow.tasks[currentAnswer.next]?
              currentAnswer.next
            else if @props.workflow.tasks[currentTask.next]?
              currentTask.next

            disabledStyle =
              opacity: 0.5
              pointerEvents: 'none'

            <div className="task-container" style={disabledStyle if @state.subjectLoading}>
              <TaskComponent task={currentTask} annotation={currentAnnotation} onChange={@updateAnnotations.bind this, currentClassification} />

              <hr />

              <nav className="task-nav">
                <button type="button" className="back minor-button" disabled={onFirstAnnotation} onClick={@destroyCurrentAnnotation}>Back</button>
                {if nextTaskKey
                  <button type="button" className="continue major-button" disabled={waitingForAnswer} onClick={@addAnnotationForTask.bind this, nextTaskKey}>Next</button>
                else
                  <button type="button" className="continue major-button" disabled={waitingForAnswer} onClick={@completeClassification}>Done</button>}
              </nav>
            </div>

          else # Classification is complete.
            @renderSummary currentClassification}
        </div>
      </div>
    }</ChangeListener>

  renderSummary: (currentClassification) ->
    <div>
      Thanks!

      {if @props.subject.expert_classification_data?
        <div className="has-expert-classification">
          Expert classification available.
          {if @state.showingExpertClassification
            <button type="button" onClick={@toggleExpertClassification.bind this, false}>Hide</button>
          else
            <button type="button" onClick={@toggleExpertClassification.bind this, true}>Show</button>}
        </div>}

      {if @state.showingExpertClassification
        'Expert classification:'
      else
        'Your classification:'}
      <ClassificationSummary workflow={@props.workflow} classification={currentClassification} />

      <hr />

      <nav className="task-nav">
        {if @props.owner? and @props.project?
          [ownerName, name] = @props.project.slug.split('/')
          <Link onClick={@props.onClickNext} to="project-talk-subject" params={owner: ownerName, name: name, id: @props.subject.id} className="talk standard-button">Talk</Link>}
        <button type="button" className="continue major-button" onClick={@props.onClickNext}>Next</button>
      </nav>
    </div>

  handleSubjectImageLoad: (e, frameIndex) ->
    @setState subjectLoading: false

    {naturalWidth, naturalHeight, clientWidth, clientHeight} = e.target

    changes = {}
    changes["metadata.subject_dimensions.#{frameIndex}"] = {naturalWidth, naturalHeight, clientWidth, clientHeight}

    @props.classification.update changes

    @props.onLoad? arguments...

  updateAnnotations: (classification) ->
    classification.update 'annotations'
    @checkToolChange classification

  checkToolChange: (classification) ->
    lastAnnotationIndex = classification.annotations.length - 1
    lastAnnotation = classification.annotations[lastAnnotationIndex]
    if @props.workflow.tasks[lastAnnotation.task].type is 'drawing'
      toolIdentifier = "#{lastAnnotationIndex}-#{lastAnnotation._toolIndex}"

      if Array.isArray(lastAnnotation.value) and toolIdentifier isnt @_lastAnnotationAndTool
        @handleToolChange lastAnnotation, @_lastAnnotationAndTool.split('-').pop() ? '-1'
        @_lastAnnotationAndTool = toolIdentifier

  handleToolChange: (annotation, oldToolIndex) ->
    lastMark = annotation.value[annotation.value.length - 1]
    if lastMark?
      ToolComponent = drawingTools[@props.workflow.tasks[annotation.task].tools[oldToolIndex].type]
      if ToolComponent?
        if ToolComponent.isComplete? and not ToolComponent.isComplete lastMark
          ToolComponent.forceComplete? lastMark

  destroyCurrentAnnotation: ->
    @props.classification.annotations.pop()
    @props.classification.update 'annotations'

  addAnnotationForTask: (taskKey) ->
    taskDescription = @props.workflow.tasks[taskKey]
    annotation = tasks[taskDescription.type].getDefaultAnnotation()
    annotation.task = taskKey
    @props.classification.annotations.push annotation
    @props.classification.update 'annotations'

  completeClassification: ->
    @props.classification.update
      completed: true
      'metadata.finished_at': (new Date).toISOString()
      'metadata.viewport':
        width: innerWidth
        height: innerHeight

    @props.onComplete?()

  toggleExpertClassification: (value) ->
    @setState showingExpertClassification: value

module.exports = React.createClass
  displayName: 'ClassifierWrapper'

  getDefaultProps: ->
    classification: mockData?.classification ? {}
    onLoad: NOOP
    onComplete: NOOP
    onClickNext: NOOP

  getInitialState: ->
    workflow: null
    subject: null

  componentDidMount: ->
    @loadClassification @props.classification

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.classification is @props.classification
      @loadClassification nextProps.classification

  loadClassification: (classification) ->
    @setState @getInitialState()

    # TODO: These underscored references are temporary stopgaps.

    Promise.resolve(classification._workflow ? classification.get 'workflow').then (workflow) =>
      @setState {workflow}

    Promise.resolve(classification._subjects ? classification.get 'subjects').then ([subject]) =>
      # We'll only handle one subject per classification right now.
      # TODO: Support multi-subject classifications in the future.
      @setState {subject}

  render: ->
    if @state.workflow? and @state.subject?
      <Classifier {...@props} {...@state} />
    else
      <span>Loading classifier</span>
