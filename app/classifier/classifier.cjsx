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

  componentDidMount: ->
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
      window.classification = classification
      workflowsStore.get(classification.workflow).then (workflow) =>
        @setState {classification, workflow}, =>
          if classification.annotations.length is 0
            @loadTask workflow.firstTask

  unloadClassification: ->
    @state.classification?.stopListening @handleClassificationChange

  handleClassificationChange: ->
    # Kinda hacky, eh?
    @forceUpdate()

  getAnnotation: ->
    # Just a shortcut:
    @state.classification?.annotations[@state.classification.annotations.length - 1]

  render: ->
      annotation = @getAnnotation()
      if annotation?
        task = @state.workflow.tasks[annotation.task]
        nextTaskKey = annotation.answer?.next ? task.next
        nextTask = @state.workflow.tasks[nextTaskKey]

        needsAnswer = task?.required and not annotation.answer?
        canGoBack = @state.classification.annotations.length > 1
        canGoForward = nextTask?

        <div className="project-classify-page">
          <div className="subject">
            <SubjectViewer classification={@state.classification.id} drawingTool={@state.drawingTool} />
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
        <p>Loading classification {@props.classification}</p>

  handleAnswer: (answer) ->
    if 'type' of answer
      @setState drawingTool: answer

    else
      annotation = @getAnnotation()
      @state.classification.apply ->
        annotation.answer = answer

  loadTask: (taskKey) ->
    @state.classification.apply =>
      @state.classification.annotations.push task: taskKey

    @setState drawingTool: @state.workflow.tasks[taskKey].tools?[0]

  previousTask: ->
    @state.classification.apply =>
      @state.classification.annotations.pop()

    taskKey = @getAnnotation().task
    @setState drawingTool: @state.workflow.tasks[taskKey].tools?[0]

  finishClassification: ->
    @state.classification.save()
