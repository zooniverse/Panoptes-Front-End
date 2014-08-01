# @cjsx React.DOM

React = require 'react'
Store = require '../data/store'
LoadingIndicator = require '../components/loading-indicator'

EXAMPLE_SUBJECT =
  id: 'EXAMPLE_SUBJECT'
  location: '//placehold.it/256.png&text=Subject'
  workflow: 'main'

classificationStore = new Store
  classification: null

  loadNextSubject: ->
    @classification =
      subject: EXAMPLE_SUBJECT
      annotations: []
    setTimeout @emit.bind(this, 'change'), 1000

  pushAnnotation: (annotation) ->
    @classification.annotations.push annotation
    setTimeout @emit.bind this, 'change'

RadioTask = React.createClass
  displayName: 'RadioTask'

  render: ->
    answers = for {value, label}, i in @props.task.answers
      <label className="answer" key={i}>
        <input type="radio" name={@props.key} value={i} checked={value is @props.annotation.value} onChange={@handleChange} />
        <span className="clickable">{label}</span>
      </label>

    <div className="radio-task">
      <div className="question">{@props.task.question}</div>
      <div className="answers">{answers}</div>
    </div>

  handleChange: (e) ->
    answerIndex = e.target.value
    annotation.value = @props.task.answers[answerIndex].value
    @props.classification.emit 'change'

module.exports = React.createClass
  displayName: 'ClassifyPage'
  mixins: [classificationStore.mixInto {'classification'}]

  taskComponents:
    radio: RadioTask

  componentWillMount: ->
    console?.log 'Classifier will mount with', @state, @props
    unless @state.classification?
      classificationStore.loadNextSubject()

  render: ->
    if @state?.classification?
      workflow = @props.project.workflows[@state.classification.subject.workflow]
      annotations = @state.classification.annotations

      <div className="project-classify-page">
        <img src={@state.classification.subject.location} />

        {if annotations.length is 0
          classificationStore.pushAnnotation task: workflow.firstTask
          <LoadingIndicator />
        else
          annotation = annotations[annotations.length - 1]
          taskKey = annotation.task
          task = workflow.tasks[taskKey]
          TaskComponent = @taskComponents[task.type]

          <div className="task">
            <TaskComponent key={taskKey} task={task} annotation={annotation} />
            <div className="task-nav">
              <button onClick={@loadPreviousTask} disbled={annotations.length < 2}>Back</button>

              {if task.next?
                <button>Next</button>
              else
                <button>Finish</button>}
            </div>
          </div>}
        </div>

    else
      <LoadingIndicator />
