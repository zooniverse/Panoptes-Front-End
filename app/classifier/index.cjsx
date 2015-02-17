React = require 'react'
HandlePropChanges = require '../lib/handle-prop-changes'
ChangeListener = require '../components/change-listener'
SubjectViewer = require './subject-viewer'
ClassificationSummary = require './classification-summary'
tasks = require './tasks'
PromiseToSetState = require '../lib/promise-to-set-state'

NOOP = Function.prototype

unless process.env.NODE_ENV is 'production'
  mockData = require './mock-data'

Classifier = React.createClass
  displayName: 'Classifier'

  mixins: [HandlePropChanges]

  getDefaultProps: ->
    unless process.env.NODE_ENV is 'production'
      {workflow, subject, classification} = mockData
    workflow: workflow
    subject: subject
    classification: classification
    onLoad: NOOP

  propChangeHandlers:
    classification: (classification) ->
      window.classification = classification
      setTimeout =>
        classification.annotations ?= []
        if classification.annotations.length is 0
          @addAnnotationForTask @props.workflow.first_task

  getInitialState: ->
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
        <SubjectViewer subject={@props.subject} workflow={@props.workflow} classification={currentClassification} annotation={currentAnnotation} onLoad={@handleSubjectImageLoad} />

        <div className="task-area">
          {if currentTask?
            TaskComponent = tasks[currentTask.type]

            onFirstAnnotation = currentClassification.annotations.indexOf(currentAnnotation) is 0

            if currentTask.type is 'single'
              currentAnswer = currentTask.answers?[currentAnnotation.value]
              waitingForAnswer = not currentAnswer

            nextTaskKey = if currentAnswer? and currentTask.type is 'single' and 'next' of currentAnswer
              currentAnswer.next
            else
              currentTask.next

            <div className="task-container">
              <TaskComponent task={currentTask} annotation={currentAnnotation} onChange={=> currentClassification.update 'annotations'} />

              <hr />

              <nav className="task-nav">
                <button type="button" className="back minor-button" disabled={onFirstAnnotation} onClick={@destroyCurrentAnnotation}>Back</button>
                {if nextTaskKey?
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
        <a className="talk standard-button" href="#/todo/talk">Talk</a>
        <button type="button" className="continue major-button" onClick={@props.onClickNext}>Next</button>
      </nav>
    </div>

  handleSubjectImageLoad: (e) ->
    @props.onLoad? arguments...

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
    @props.onComplete?()

  toggleExpertClassification: (value) ->
    @setState showingExpertClassification: value

module.exports = React.createClass
  displayName: 'ClassifierWrapper'

  mixins: [HandlePropChanges, PromiseToSetState]

  getDefaultProps: ->
    classification: if process.env.NODE_ENV is 'production'
        null
      else
        mockData.classification

  getInitialState: ->
    workflow: null
    subject: null

  propChangeHandlers:
    classification: (classification) ->
      @promiseToSetState
        # TODO: These underscored references are temporary stopgaps.
        workflow: Promise.resolve classification._workflow ? classification.get 'workflow'
        subject: Promise.resolve classification._subject ? classification.get('subjects').then ([subject]) ->
          subject

  render: ->
    if @state.workflow? and @state.subject?
      <Classifier {...@props} workflow={@state.workflow} subject={@state.subject} />
    else
      <span>Loading classifier</span>
