# @cjsx React.DOM

React = require 'react'
Store = require '../data/store'
{dispatch} = require '../data/dispatcher'
LoadingIndicator = require '../components/loading-indicator'

EXAMPLE_SUBJECT =
  id: 'EXAMPLE_SUBJECT'
  location: '//placehold.it/256.png&text=Subject'
  workflow: 'main'

classificationStore = window.cS = new Store
  classification: null

  createClassification: ->
    @classification =
      subject: EXAMPLE_SUBJECT
      annotations: []
    setTimeout @emit.bind(this, 'change'), 1000

  pushAnnotation: (annotation) ->
    @classification.annotations.push annotation
    setTimeout @emit.bind this, 'change'

  popAnnotation: ->
    @classification.annotations.pop()
    setTimeout @emit.bind this, 'change'

  handlers:
    'classification:create': (projectID) ->
      @createClassification()

    'classification:annotation:create': (classification, task) ->
      if classification is @classification
        @pushAnnotation {task}

    'classification:annotation:destroy': (classification) ->
      if classification is @classification
        @popAnnotation()

    'classification:answer': (classification, answer) ->
      if classification is @classification
        annotationIndex = @classification.annotations.length - 1
        @set "classification.annotations.#{annotationIndex}.answer", answer

    'classification:save': (classification) ->
      console.log 'hi'
      if classification is @classification

        data = classification:
          subject: @classification.subject.id
          annotations: for {task, answer, marks} in @classification.annotations
            task: task
            value: marks ? answer.value

        console.log 'Saving', JSON.stringify data

SubjectView = React.createClass
  displayName: 'SubjectView'

  render: ->
    <img src={@props.subject.location} />

RadioTask = React.createClass
  displayName: 'RadioTask'

  render: ->
    answers = for answer, i in @props.answers
      <label className="answer" key={i}>
        <input type="radio" name={@props.key} value={i} checked={answer is @props.answer} onChange={@handleChange} />
        <span className="clickable">{answer.label}</span>
      </label>

    <div className="radio-task">
      <div className="question">{@props.question}</div>
      <div className="answers">{answers}</div>
    </div>

  handleChange: (e) ->
    answerIndex = e.target.value
    @props.onChange @props.answers[answerIndex]

module.exports = React.createClass
  displayName: 'ClassifyPage'
  mixins: [classificationStore.mixInto {'classification'}]

  taskComponents:
    radio: RadioTask

  render: ->
    if @state?.classification?
      subjectView = <SubjectView subject={@state.classification.subject} annotations={@state.classification.annotations} />

      workflow = @props.project.workflows[@state.classification.subject.workflow]

      annotations = @state.classification.annotations

      taskView = if annotations.length is 0
        @loadTask workflow.firstTask
        <div></div>

      else
        annotation = annotations[annotations.length - 1]
        task = workflow.tasks[annotation.task]
        TaskComponent = @taskComponents[task.type]
        <TaskComponent key={annotation.task} question={task.question} answers={task.answers} answer={annotation.answer} onChange={@handleAnswer} />

      backButton = <button disabled={annotations.length < 2} onClick={@previousTask}>Back</button>

      nextTask = annotation?.answer?.next ? workflow.tasks[annotation?.task]?.next
      continueButton = if nextTask?
        <button onClick={@loadTask.bind this, nextTask}>Next</button>
      else
        <button onClick={@finishClassification}>Finish</button>

      <div className="project-classify-page">
        <div className="subject">
          {subjectView}
        </div>

        <div className="task">
          {taskView}
          <div className="task-nav">
            {backButton}
            {continueButton}
          </div>
        </div>
      </div>

    else
      @requestClassification()
      <LoadingIndicator />

  requestClassification: ->
    dispatch 'classification:create', @props.project.id

  handleAnswer: (answer) ->
    dispatch 'classification:answer', @state.classification, answer

  previousTask: ->
    dispatch 'classification:annotation:destroy', @state.classification

  loadTask: (task) ->
    dispatch 'classification:annotation:create', @state.classification, task

  finishClassification: ->
    dispatch 'classification:save', @state.classification
