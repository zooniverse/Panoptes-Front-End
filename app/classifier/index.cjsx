React = require 'react'
ChangeListener = require '../components/change-listener'
SubjectViewer = require './subject-viewer'
ClassificationSummary = require './classification-summary'
tasks = require './tasks'
HandlePropChanges = require '../lib/handle-prop-changes'
PromiseToSetState = require '../lib/promise-to-set-state'

unless process.env.NODE_ENV is 'production'
  mockData = require './mock-data'

Classifier = React.createClass
  displayName: 'Classifier'

  getDefaultProps: ->
    unless process.env.NODE_ENV is 'production'
      {workflow, subject, classification} = mockData
    workflow: workflow
    subject: subject
    classification: classification

  getInitialState: ->
    showingExpertClassification: false
    selectedExpertAnnotation: -1

  render: ->
    <ChangeListener target={@props.classification}>{=>
      currentClassification = if @state.showingExpertClassification
        @props.subject.expert_classification_data
      else
        @props.classification

      currentAnnotation = if @state.showingExpertClassification
        currentClassification.annotations[@state.selectedExpertAnnotation]
      else
        currentClassification.annotations[currentClassification.annotations.length - 1]

      currentTask = @props.workflow.tasks[currentAnnotation?.task]

      onFirstAnnotation = currentClassification.annotations.indexOf(currentAnnotation) is 0

      currentAnswer = currentTask.answers?[currentAnnotation.value]
      nextTaskKey = if currentAnswer? and currentTask.type is 'single' and 'next' of currentAnswer
        currentAnswer.next
      else
        currentTask.next

      waitingForAnswer = currentTask.type is 'single' and not currentAnnotation.value?

      <div className="classifier">
        <SubjectViewer subject={@props.subject} workflow={@props.workflow} classification={currentClassification} annotation={currentAnnotation} loading={@props.loading} />

        <div className="task-area">
          <div className="task-container">
            {if @props.classification.completed
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
              </div>

            else if currentTask?
              TaskComponent = tasks[currentTask.type]
              <TaskComponent task={currentTask} annotation={currentAnnotation} onChange={@handleTaskChange} />

            else
              <span><i className="fa fa-exclamation-circle"></i> No task ready</span>}
          </div>

          {if @props.classification.completed
            <nav className="task-nav for-summary">
              <a className="talk" href="#/todo/talk">Talk</a>
              <button type="button" className="continue" disabled={@props.loading} onClick={@props.onClickNext}>Next</button>
            </nav>

          else if currentTask?
            <nav className="task-nav for-classification">
              <button type="button" className="back" disabled={onFirstAnnotation || null} onClick={currentAnnotation.destroy.bind currentAnnotation}>Back</button>
              {if nextTaskKey?
                nextTaskType = @props.workflow.tasks[nextTaskKey].type
                <button type="button" className="continue" disabled={waitingForAnswer || null} onClick={currentClassification.annotate.bind currentClassification, nextTaskType, nextTaskKey}>Next</button>
              else
                <button type="button" className="continue" disabled={waitingForAnswer || null} onClick={@completeClassification}>Done</button>}
            </nav>}
        </div>
      </div>
    }</ChangeListener>

  completeClassification: ->
    @props.classification.update completed: true
    @props.classification.metadata.finished_at = (new Date).toISOString()
    @props.classification.update 'metadata'
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
        workflow: Promise.resolve classification._workflow ? classification.link 'workflow'
        subject: Promise.resolve classification._subject ? classification.link('subjects').then ([subject]) ->
          subject

  render: ->
    if @state.workflow? and @state.subject?
      <Classifier {...@props} workflow={@state.workflow} subject={@state.subject} />
    else
      null
