# @cjsx React.DOM

React = require 'react'
subjectsStore = require '../data/subjects'
workflowsStore = require '../data/workflows'
classificationsStore = require '../data/classifications'
SubjectViewer = require './subject-viewer'
TaskViewer = require './task-viewer'
{dispatch} = require '../lib/dispatcher'

module.exports = React.createClass
  displayName: 'Classifier'

  componentWillMount: ->
    @componentWillReceiveProps @props

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.subject is @state?.subject?.id
      subjectsStore.get(nextProps.subject).then (subject) =>
        setTimeout @setState.bind this, {subject}

  render: ->
    console.log "Rendering #{@constructor.displayName}", @state?.subject?

    return if @state?.subject?
      <p>Classifier OK</p>
    else
      <p>Classifier waiting on subject</p>

    if @state.subject?
        <p>Waiting for workflow</p>
    else
      @fetchSubject()
      <p>Waiting for subject</p>

  WAS_RENDER: ->
    workflow = @props.project.workflows[@state.classification?.subject.workflow]
    annotation = @state.classification?.annotations[@state.classification?.annotations.length - 1]
    task = workflow?.tasks[annotation?.task]
    next = annotation?.answer?.next ? task?.next

    <div className="project-classify-page">
      <div className="subject">
        <SubjectViewer subject={@state.classification?.subject} />
      </div>

      <div className="task">
        <TaskViewer workflow={workflow} annotation={annotation} task={task} onChange={@handleAnswer} />

        <div className="task-nav">
          <button onClick={@previousTask} disabled={@state.classification?.annotations.length < 2}><i className="fa fa-arrow-left"></i></button>
          <button onClick={@loadTask.bind this, next} disabled={not next?}><i className="fa fa-check"></i></button>
          <button onClick={@finishClassification}disabled={next?}><i className="fa fa-flag-checkered"></i></button>
        </div>
      </div>
    </div>

  loadTask: (task) ->
    dispatch 'classification:annotation:create', @props.project, task

  handleAnswer: (answer) ->
    dispatch 'classification:answer', @props.project, answer

  previousTask: ->
    dispatch 'classification:annotation:destroy-last', @props.project

  finishClassification: ->
    dispatch 'classification:save', @props.project
