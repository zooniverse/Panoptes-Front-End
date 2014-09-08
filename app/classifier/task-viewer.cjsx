# @cjsx React.DOM

React = require 'react'
subjectsStore = require '../data/subjects'
workflowsStore = require '../data/workflows'
LoadingIndicator = require '../components/loading-indicator'

taskComponents =
  single: require './tasks/single'
  multiple: require './tasks/multiple'

module.exports = React.createClass
  displayName: 'TaskViewer'

  getInitialState: ->
    subject: null
    workflow: null

  componentWillMount: ->
    @loadWorkflowFor @props.subject

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.subject is @state.subject?.id
      @loadWorkflowFor nextProps.subject

  loadWorkflowFor: (subject) ->
    subjectsStore.get(subject).then (subject) =>
      workflowsStore.get(subject.workflow).then (workflow) =>
        @setState {subject, workflow}

  render: ->
    console?.log "Rendering #{@constructor.displayName}", '@props', @props, '@state', @state

    if @state.workflow?
      annotation = @props.classification.annotations[@props.classification.annotations.length - 1]
      task = @state.workflow.tasks[annotation?.task]
      TaskComponent = taskComponents[task?.type]

      if TaskComponent?
        <TaskComponent question={task.question} answers={task.answers} answer={annotation.answer} onChange={@props.onChange} />

    else
      <p>Loading task viewer</p>
