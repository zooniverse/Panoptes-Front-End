counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
ChangeListener = require '../components/change-listener'
SubjectViewer = require './subject-viewer'
TaskViewer = require './task-viewer'

counterpart.registerTranslations 'en',
  classifier:
    next: 'Next'
    finished: 'Finished'

DEV_CLASSIFICATION_DATA = unless process.env.NODE_ENV is 'production'
  do ->
    apiClient = require '../api/client'

    # This is just a blank image for testing drawing tools.
    DEMO_IMAGE = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgAQMAAAA',
      'PH06nAAAABlBMVEXMzMyWlpYU2uzLAAAAPUlEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAA',
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgzwCX4AAB9Dl2RwAAAABJRU5ErkJggg=='].join ''

    workflow = apiClient.type('workflows').create
      first_task: 'draw'
      tasks:
        draw:
          type: 'drawing'
          tools: [
            {type: 'point', value: 'point', label: 'Point', color: 'red'}
            {type: 'line', value: 'line', label: 'Line', color: 'red'}
            {type: 'rectangle', value: 'rectangle', label: 'Rectangle', color: 'red'}
            {type: 'polygon', value: 'polygon', label: 'Polygon', color: 'red'}
            {type: 'ellipse', value: 'ellipse', label: 'Ellipse', color: 'red'}
          ]

    subject = apiClient.type('subjects').create
      locations: [{'image/png': DEMO_IMAGE}]

    classification = apiClient.type('classifications').create
      annotations: [{task: 'draw'}]

    {workflow, subject, classification}

module.exports = React.createClass
  displayName: 'Classifier'

  getDefaultProps: ->
    DEV_CLASSIFICATION_DATA

  getInitialState: ->
    selectedDrawingTool: @getTask()?.tools?[0]

  getAnnotation: ->
    @props.classification.annotations[@props.classification.annotations.length - 1]

  getTask: ->
    @props.workflow.tasks[@getAnnotation().task]

  render: ->
    <ChangeListener target={@props.classification} eventName="change" handler={@renderClassification} />

  renderClassification: ->
    annotation = @getAnnotation()
    task = @props.workflow.tasks[annotation.task]
    currentTool = @state.selectedDrawingTool

    <div className="project-classify-page">
      <button type="button" name="scroll-to-classifier" onClick={@scrollIntoView}>
        <i className="fa fa-anchor"></i>
      </button>
      {@renderSubject annotation, currentTool}
      {@renderTaskArea annotation, task, currentTool}
    </div>

  renderSubject: (annotation, currentTool) ->
    <div className="subject">
      <SubjectViewer subject={@props.subject} classification={@props.classification} annotation={annotation} selectedDrawingTool={currentTool} />
    </div>

  renderTaskArea: (annotation, task, currentTool) ->
    onFirstTask = @props.classification.annotations.length is 1
    givenAnswers = (answer for answer in [].concat annotation.answer when answer?)
    answerStillRequired = givenAnswers.length < task.required ? 0
    nextTaskKey = annotation._answer?.next ? task.next

    <div className="classifier-task">
      <TaskViewer task={task} annotation={annotation} selectedDrawingTool={currentTool} onChange={@handleAnswer} />

      <div className="task-nav">
        <button className="backward" disabled={onFirstTask} onClick={@previousTask}><i className="fa fa-arrow-left"></i></button>

        {if nextTaskKey?
          <button className="forward" disabled={answerStillRequired} onClick={@loadTask.bind this, nextTaskKey}>
            <Translate content="classifier.next" />{' '}
            <i className="fa fa-arrow-right"></i>
          </button>
        else
          <button className="forward" disabled={answerStillRequired} onClick={@finishClassification}>
            <Translate content="classifier.finished" />{' '}
            <i className="fa fa-check"></i>
          </button>}
      </div>
    </div>

  scrollIntoView: (e) ->
    scrollTo scrollX, e.target.getBoundingClientRect().top

  handleAnswer: (e, answer) ->
    switch @getTask().type
      when 'drawing'
        @setState selectedDrawingTool: answer
      else
        @getAnnotation().answer = answer.value
        @getAnnotation()._answer = answer
        @props.classification.emit 'change'

  loadTask: (task) ->
    @props.classification.annotations.push {task}
    @props.classification.emit 'change'

  previousTask: ->
    @props.classification.annotations.pop()
    @props.classification.emit 'change'
    @setState selectedDrawingTool: @getTask().tools?[0]

  finishClassification: ->
    @props.onFinishClassification @props.classification
