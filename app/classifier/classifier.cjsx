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
          nextTaskKey = annotation?.answer?.next ? @state.workflow.tasks[annotation?.task].next
          nextTask = @state.workflow.tasks[nextTaskKey]
        else
          @loadTask @state.workflow.firstTask

      <div className="project-classify-page">
        <div className="subject">
          <SubjectViewer subject={@state.classification.subject} annotations={@state.classification.annotations} />
        </div>

        <div className="task">
          <TaskViewer subject={@state.classification.subject} classification={@state.classification} onChange={@handleAnswer} />

          <div className="task-nav">
            <button onClick={@previousTask} disabled={@state.classification.annotations.length < 2}><i className="fa fa-arrow-left"></i></button>
            <button onClick={@loadTask.bind this, nextTaskKey} disabled={not nextTask?}><i className="fa fa-check"></i></button>
            <button onClick={@finishClassification}disabled={nextTask?}><i className="fa fa-flag-checkered"></i></button>
          </div>
        </div>
      </div>

    else
      <p>Loading classification {@props}</p>

  handleAnswer: (answer) ->
    annotation = @state.classification.annotations[@state.classification.annotations.length - 1]
    @state.classification.apply =>
      annotation.answer = answer

  loadTask: (taskKey) ->
    @state.classification.apply =>
      @state.classification.annotations.push task: taskKey

  previousTask: ->
    @state.classification.annotations.pop()
    @state.classification.emitChange()

  finishClassification: ->
    @state.classification.save()
