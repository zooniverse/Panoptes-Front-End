# @cjsx React.DOM

React = require 'react'
Store = require '../data/store'
{dispatch} = require '../data/dispatcher'
LoadingIndicator = require '../components/loading-indicator'

EXAMPLE_SUBJECT =
  id: 'EXAMPLE_SUBJECT'
  location: '//placehold.it/256.png&text=Subject'
  workflow: 'main'

classifierStore = window.ccs = new Store
  classifications: {}

  handlers:
    'classification:create': (project) ->
      console.log 'Fetching subject'
      fetchSubject = new Promise (resolve, reject) ->
        setTimeout resolve.bind(null, EXAMPLE_SUBJECT), 1000

      fetchSubject.then (subject) =>
        console.log 'Fetched subject'
        firstTask = project.workflows[subject.workflow].firstTask
        @classifications[project.id] =
          subject: subject
          annotations: [{task: firstTask}]

    'classification:annotation:create': (project, task) ->
      @classifications[project.id].annotations.push {task}

    'classification:annotation:destroy-last': (project) ->
      @classifications[project.id].annotations.pop()

    'classification:answer': (project, answer) ->
      annotations = @classifications[project.id].annotations
      annotations[annotations.length - 1].answer = answer

    'classification:save': (project) ->
      data =
        classification:
          subject: @classifications[project.id].subject.id
          annotations: for {task, answer, marks} in @classifications[project.id].annotations
            task: task
            value: marks ? answer.value

      console?.info 'Saving', JSON.stringify data

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

  componentDidMount: ->
    classifierStore.listen @updateState

  componentWillUnmount: ->
    classifierStore.stopListening @updateState

  updateState: ->
    @setState
      classification: classifierStore.classifications[@props.project.id]

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
    dispatch 'classification:create', @props.project

  handleAnswer: (answer) ->
    dispatch 'classification:answer', @props.project, answer

  loadTask: (task) ->
    dispatch 'classification:annotation:create', @props.project, task

  previousTask: ->
    dispatch 'classification:annotation:destroy-last', @props.project

  finishClassification: ->
    dispatch 'classification:save', @props.project
