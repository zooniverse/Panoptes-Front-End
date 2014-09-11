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
    selectedDrawingTool: null

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
            <SubjectViewer classification={@state.classification.id} selectedDrawingTool={@state.selectedDrawingTool} />
          </div>

          <div className="classifier-task">
            <TaskViewer subject={@state.classification.subject} classification={@state.classification} selectedDrawingTool={@state.selectedDrawingTool} onChange={@handleAnswer} />

            <div className="task-nav">
              <button className="backward" disabled={not canGoBack} onClick={@previousTask}><i className="fa fa-arrow-left"></i></button>
              {if canGoForward
                <button className="forward" disabled={needsAnswer} onClick={@loadTask.bind this, nextTaskKey}>Next <i className="fa fa-arrow-right"></i></button>
              else
                <button className="forward" disabled={needsAnswer} onClick={@finishClassification}>Done <i className="fa fa-check"></i></button>}
            </div>
          </div>
        </div>

      else
        <p>Loading classification {@props.classification}</p>

  handleAnswer: (answer) ->
    if answer? and 'type' of answer
      @setState selectedDrawingTool: answer

    else
      annotation = @getAnnotation()
      @state.classification.apply ->
        annotation.answer = answer

  loadTask: (taskKey) ->
    @state.classification.apply =>
      @state.classification.annotations.push task: taskKey

    @setState selectedDrawingTool: @state.workflow.tasks[taskKey].tools?[0]

  previousTask: ->
    @state.classification.apply =>
      @state.classification.annotations.pop()

    taskKey = @getAnnotation().task
    @setState selectedDrawingTool: @state.workflow.tasks[taskKey].tools?[0]

  finishClassification: ->
    @state.classification.save()
