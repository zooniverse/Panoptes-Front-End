React = require 'react'
ChangeListener = require '../components/change-listener'
SubjectViewer = require './subject-viewer'
TaskViewer = require './task-viewer'

module.exports = React.createClass
  displayName: 'Classifier'

  getInitialState: ->
    selectedDrawingTool: @getTask()?.tools?[0]

  getAnnotation: ->
    @props.classification.annotations[@props.classification.annotations.length - 1]

  getTask: ->
    @props.workflow.tasks[@getAnnotation().task]

  render: ->
    <ChangeListener target={@props.classification} eventName="change" handler={@renderClassification} />

  renderClassification: ->
    annotation = @getAnnotation()
    task = @props.workflow.tasks[annotation.task]
    currentTool = @state.selectedDrawingTool

    <div className="project-classify-page">
      <button type="button" name="scroll-to-classifier" onClick={@scrollIntoView}>
        <i className="fa fa-anchor"></i>
      </button>
      {@renderSubject annotation, currentTool}
      {@renderTaskArea annotation, task, currentTool}
    </div>

  renderSubject: (annotation, currentTool) ->
    <div className="subject">
      <SubjectViewer subject={@props.subject} classification={@props.classification} annotation={annotation} selectedDrawingTool={currentTool} />
    </div>

  renderTaskArea: (annotation, task, currentTool) ->
    onFirstTask = @props.classification.annotations.length is 1
    givenAnswers = (answer for answer in [].concat annotation.answer when answer?)
    answerStillRequired = givenAnswers.length < task.required ? 0
    nextTaskKey = annotation._answer?.next ? task.next

    <div className="classifier-task">
      <TaskViewer task={task} annotation={annotation} selectedDrawingTool={currentTool} onChange={@handleAnswer} />

      <div className="task-nav">
        <button className="backward" disabled={onFirstTask} onClick={@previousTask}><i className="fa fa-arrow-left"></i></button>

        {if nextTaskKey?
          <button className="forward" disabled={answerStillRequired} onClick={@loadTask.bind this, nextTaskKey}>Next <i className="fa fa-arrow-right"></i></button>
        else
          <button className="forward" disabled={answerStillRequired} onClick={@finishClassification}>Finished <i className="fa fa-check"></i></button>}
      </div>
    </div>

  scrollIntoView: (e) ->
    scrollTo scrollX, e.target.getBoundingClientRect().top

  handleAnswer: (e, answer) ->
    switch @getTask().type
      when 'drawing'
        @setState selectedDrawingTool: answer
      else
        @getAnnotation().answer = answer.value
        @getAnnotation()._answer = answer
        @props.classification.emit 'change'

  loadTask: (task) ->
    @props.classification.annotations.push {task}
    @props.classification.emit 'change'

  previousTask: ->
    @props.classification.annotations.pop()
    @props.classification.emit 'change'
    @setState selectedDrawingTool: @getTask().tools?[0]

  finishClassification: ->
    @props.onFinishClassification @props.classification
