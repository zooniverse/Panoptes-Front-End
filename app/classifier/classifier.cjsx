React = require 'react'
subjectsStore = require '../mock-data/subjects'
workflowsStore = require '../mock-data/workflows'
SubjectViewer = require './subject-viewer'
TaskViewer = require './task-viewer'
{dispatch} = require '../lib/dispatcher'

# This module takes a classification object and loads its subject and workflow,
# then passes everything into the SubjectViewer and TaskViewer.

module.exports = React.createClass
  displayName: 'Classifier'

  getInitialState: ->
    subject: null
    workflow: null
    selectedDrawingTool: null

  componentDidMount: ->
    @loadClassification @props.classification

  componentWillUnmount: ->
    @unloadCurrentClassification()

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.classification is @props.classification
      @unloadCurrentClassification()
      @loadClassification nextProps.classification

  loadClassification: (classification) ->
    classification.listen @handleClassificationChange
    @setState subject: null, workflow: null, =>
      @loadSubject classification.subject
      @loadWorkflow classification.workflow

  unloadCurrentClassification: ->
    @props.classification.stopListening @handleClassificationChange

  loadSubject: (id) ->
    subjectsStore.get(id).then (subject) =>
      @setState {subject}

  loadWorkflow: (id) ->
    workflowsStore.get(id).then (workflow) =>
      @setState {workflow}

  handleClassificationChange: ->
    # Kinda hacky, eh?
    @forceUpdate()

  loadTask: (taskKey) ->
    dispatch 'classification:annotate', @props.classification, taskKey
    @setState selectedDrawingTool: @state.workflow.tasks[taskKey].tools?[0]

  getAnnotation: ->
    # Just a shortcut:
    @props.classification.annotations[@props.classification.annotations.length - 1]

  render: ->
      annotation = @getAnnotation()
      if annotation?
        task = @state.workflow?.tasks[annotation.task]
        currentTool = @state.selectedDrawingTool ? task?.tools?[0]
        nextTaskKey = annotation.answer?.next ? task?.next

      canGoBack = @props.classification.annotations.length > 1
      needsAnswer = task?.required and not annotation.answer?
      canGoForward = nextTaskKey?

      <div className="project-classify-page">
        <div className="subject">
          {if @state.subject?
            <SubjectViewer subject={@state.subject} classification={@props.classification} selectedDrawingTool={currentTool} />
          else
            <p>Loading subject {@props.classification.subject}</p>}
        </div>

        <div className="classifier-task">
          {if @state.workflow?
            <TaskViewer task={task} annotation={annotation} selectedDrawingTool={currentTool} onChange={@handleAnswer} />
          else
            <p>Loading workflow {@props.classification.workflow}</p>}

          <div className="task-nav">
            <button className="backward" disabled={not canGoBack} onClick={@previousTask}><i className="fa fa-arrow-left"></i></button>
            {if canGoForward
              <button className="forward" disabled={needsAnswer} onClick={@loadTask.bind this, nextTaskKey}>Next <i className="fa fa-arrow-right"></i></button>
            else
              <button className="forward" disabled={needsAnswer} onClick={@finishClassification}>Done <i className="fa fa-check"></i></button>}
          </div>
        </div>
      </div>

  handleAnswer: (answer) ->
    if answer? and 'type' of answer
      @setState selectedDrawingTool: answer
    else
      dispatch 'classification:annotation:update', @props.classification, @getAnnotation(), answer

  previousTask: ->
    dispatch 'classification:annotation:abort', @props.classification, @getAnnotation()
    taskKey = @getAnnotation().task
    @setState selectedDrawingTool: @state.workflow.tasks[taskKey].tools?[0]

  finishClassification: ->
    dispatch 'classification:save', @props.classification
