# @cjsx React.DOM

React = require 'react'
subjectsStore = require '../data/subjects'
workflowsStore = require '../data/workflows'
LoadingIndicator = require '../components/loading-indicator'

taskComponents =
  radio: require './tasks/radio'

module.exports = React.createClass
  displayName: 'TaskViewer'

  getInitialState: ->
    subject: null
    workflow: null

  componentWillMount: ->
    @loadWorkflowFor @props.subject

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.subject is @state.subject?.id
      @loadWorkflowFor subject

  loadWorkflowFor: (subject) ->
    subjectsStore.get(subject).then (subject) =>
      workflowsStore.get(subject.workflow).then (workflow) =>
        if @props.classification.annotations.length is 0
          @props.classification.annotations.push task: workflow.firstTask
        setTimeout => @setState {subject, workflow}

  render: ->
    if @state.workflow?
      annotation = @props.classification.annotations[@props.classification.annotations.length - 1]
      task = @state.workflow.tasks[annotation.task]
      TaskComponent = taskComponents[task?.type]
      <TaskComponent question={task.question} answers={task.answers} answer={annotation.answer} onChange={@props.onChange} />

    else
      <p>Loading task viewer</p>
