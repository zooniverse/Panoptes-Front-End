# @cjsx React.DOM

React = require 'react'
classificationsStore = require '../data/classifications'
workflowsStore = require '../data/workflows'
SubjectViewer = require './subject-viewer'
TaskViewer = require './task-viewer'
{dispatch} = require '../lib/dispatcher'

module.exports = React.createClass
  displayName: 'Classifier'

  getInitialState: ->
    classification: null
    workflow: null
    drawingTool: null

  componentWillMount: ->
    @loadClassification @props.classification

  componentWillUnmount: ->
    @unloadClassification()

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.classification is @state.classification?.id
      @unloadClassification()
      @loadClassification nextProps.classification

  loadClassification: (id) ->
    classificationsStore.get(id).then (classification) =>
      classification.listen @handleClassificationChange
      @setState {classification}
      workflowsStore.get(classification.workflow).then (workflow) =>
        @setState {workflow}

  unloadClassification: ->
    @state.classification?.stopListening @handleClassificationChange

  handleClassificationChange: ->
    # Kinda hacky, eh?
    @forceUpdate()

  render: ->
    console?.log "Rendering #{@constructor.displayName}", '@props', @props, '@state', @state

    if @state.classification?
      if @state.workflow?
        annotation = @state.classification.annotations[@state.classification.annotations.length - 1]

        if annotation?
          task = @state.workflow.tasks[annotation?.task]
          nextTaskKey = annotation?.answer?.next ? task.next
          nextTask = @state.workflow.tasks[nextTaskKey]
        else
          @loadTask @state.workflow.firstTask

      needsAnswer = task?.required and not annotation?.answer?
      canGoBack = @state.classification.annotations.length > 1
      canGoForward = nextTask?

      <div className="project-classify-page">
        <div className="subject">
          <SubjectViewer subject={@state.classification.subject} annotations={@state.classification.annotations} drawingTool={@state.drawingTool} />
        </div>

        <div className="task">
          <TaskViewer subject={@state.classification.subject} classification={@state.classification} drawingTool={@state.drawingTool} onChange={@handleAnswer} />

          <div className="task-nav">
            <button onClick={@previousTask} disabled={not canGoBack}><i className="fa fa-arrow-left"></i></button>
            <button onClick={@loadTask.bind this, nextTaskKey} disabled={needsAnswer or not canGoForward}><i className="fa fa-check"></i></button>
            <button onClick={@finishClassification} disabled={needsAnswer or canGoForward}><i className="fa fa-flag-checkered"></i></button>
          </div>
        </div>
      </div>

    else
      <p>Loading classification {@props}</p>

  loadTask: (taskKey) ->
    @state.classification.apply =>
      @state.classification.annotations.push
        task: taskKey

    if 'tools' of @state.workflow.tasks[taskKey]
      firstTool = @state.workflow.tasks[taskKey].tools[0]

    setTimeout =>
      # Gross.
      @setState drawingTool: firstTool

  handleAnswer: (answer) ->
    if 'tool' of answer
      @setState drawingTool: answer

    else
      annotation = @state.classification.annotations[@state.classification.annotations.length - 1]
      @state.classification.apply ->
        annotation.answer = answer

  previousTask: ->
    @state.classification.annotations.pop()
    @state.classification.emitChange()

  finishClassification: ->
    @state.classification.save()
