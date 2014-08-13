# @cjsx React.DOM

React = require 'react'
workflowsStore = require '../data/workflows'
classificationsStore = require '../data/classifications'
SubjectViewer = require './subject-viewer'
TaskViewer = require './task-viewer'
{dispatch} = require '../lib/dispatcher'

module.exports = React.createClass
  displayName: 'Classifier'

  getInitialState: ->
    classification: null

  componentWillMount: ->
    @loadClassification @props.classification

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.classification is @state.classification?.id
      @loadClassification nextProps.classification

  loadClassification: (id) ->
    @state.classification?.stopListening @handleClassificationChange
    classificationsStore.get(id).then (classification) =>
      classification.listen @handleClassificationChange
      @setState {classification}

  handleClassificationChange: ->
    # Kinda hacky, eh?
    @forceUpdate()

  render: ->
    console.log "Rendering #{@constructor.displayName}", {@props}, {@state}

    if @state.classification?
      <div className="project-classify-page">
        <div className="subject">
          <SubjectViewer subject={@state.classification.subject} annotations={@state.classification.annotations} />
        </div>

        <div className="task">
          <TaskViewer subject={@state.classification.subject} classification={@state.classification} onChange={@handleAnswer} />
        </div>
      </div>

    else
      <p>Loading classification {@props}</p>

  # TASK_NAV = ->
  #   <div className="task-nav">
  #     <button onClick={@previousTask} disabled={@state.classification?.annotations.length < 2}><i className="fa fa-arrow-left"></i></button>
  #     <button onClick={@loadTask.bind this, next} disabled={not next?}><i className="fa fa-check"></i></button>
  #     <button onClick={@finishClassification}disabled={next?}><i className="fa fa-flag-checkered"></i></button>
  #   </div>

  handleAnswerChange: ->
    console.log 'ANSWER CHANGED', this, arguments

  loadTask: (task) ->
    dispatch 'classification:annotation:create', @props.project, task

  handleAnswer: (answer) ->
    @state.classification.apply =>
      @state.classification.annotations[@state.classification.annotations.length - 1].answer = answer

  previousTask: ->
    dispatch 'classification:annotation:destroy-last', @props.project

  finishClassification: ->
    dispatch 'classification:save', @props.project
