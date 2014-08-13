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
        workflowsStore.get(subject.workflow).then (workflow) =>
          classification = classificationsStore.get(subject: subject.id).then ([classification]) =>
            classification ?= classificationsStore.create subject: subject.id
            if classification.annotations.length is 0
              classification.annotations.push task: workflow.firstTask
            console.log 'PAGE SETTING', {subject, workflow, classification}
            setTimeout @setState.bind this, {subject, workflow, classification}

  render: ->
    console.log "Rendering #{@constructor.displayName}", @state?.subject, @state?.workflow

    annotations = @state?.classification?.annotations

    <div className="project-classify-page">
      <div className="subject">
        <SubjectViewer subject={@state?.subject} annotations={annotations} />
      </div>
      <div className="task">
        <TaskViewer workflow={@state?.workflow} annotation={annotations?[annotations.length - 1]} onChange={@handleAnswerChange} />
      </div>
    </div>

  # TASK_NAV = ->
  #   <div className="task-nav">
  #     <button onClick={@previousTask} disabled={@state?.classification?.annotations.length < 2}><i className="fa fa-arrow-left"></i></button>
  #     <button onClick={@loadTask.bind this, next} disabled={not next?}><i className="fa fa-check"></i></button>
  #     <button onClick={@finishClassification}disabled={next?}><i className="fa fa-flag-checkered"></i></button>
  #   </div>

  handleAnswerChange: ->
    console.log 'ANSWER CHANGED', this, arguments

  loadTask: (task) ->
    dispatch 'classification:annotation:create', @props.project, task

  handleAnswer: (answer) ->
    dispatch 'classification:answer', @props.project, answer

  previousTask: ->
    dispatch 'classification:annotation:destroy-last', @props.project

  finishClassification: ->
    dispatch 'classification:save', @props.project
