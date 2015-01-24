React = require 'react'
ChangeListener = require '../components/change-listener'
tasks = require './tasks'
drawingTools = require './drawing-tools'

unless process.env.NODE_ENV is 'production'
  mockData = require './mock-data'

READABLE_FORMATS =
  image: ['jpg', 'png', 'svg+xml', 'gif']

module.exports = React.createClass
  displayName: 'Classifier'

  getDefaultProps: ->
    unless process.env.NODE_ENV is 'production'
      {workflow, subject, classification} = mockData
    workflow: workflow
    subject: subject
    classification: classification

  getInitialState: ->
    naturalWidth: 0
    naturalHeight: 0
    frame: 0
    showingSummary: false
    showingExpertClassification: false
    selectedExpertAnnotation: null

  componentDidMount: ->
    if @props.classification.annotations.length is 0
      @props.classification.annotate @props.workflow.tasks[@props.workflow.first_task].type, @props.workflow.first_task

  render: ->
    <ChangeListener target={@props.classification} handler={@renderClassifier} />

  renderClassifier: ->
    currentClassification = if @state.showingExpertClassification
      @props.subject.expert_classification_data
    else
      @props.classification

    currentAnnotation = if @state.showingExpertClassification
      currentClassification.annotations[@state.selectedExpertAnnotation]
    else
      currentClassification.annotations[currentClassification.annotations.length - 1]

    currentTask = @props.workflow.tasks[currentAnnotation?.task]

    for mimeType, src of @props.subject.locations[@state.frame]
      [subjectType, format] = mimeType.split '/'
      if subjectType of READABLE_FORMATS and format in READABLE_FORMATS[subjectType]
        subjectSrc = src
        break

    # These styles are critical to keeping everything lined up.
    subjectAreaStyle = display: 'block'
    subjectContainerStyle = display: 'inline-block', position: 'relative'
    subjectStyle = display: 'block'
    svgStyle = height: '100%', left: 0, position: 'absolute', top: 0, width: '100%'

    <div className="classifier">
      <div className="subject-area" style={subjectAreaStyle}>
        <div className="subject-container" style={subjectContainerStyle}>
          {switch subjectType
            when 'image' then <img className="subject" src={subjectSrc} style={subjectStyle} onLoad={@handleSubjctImageLoad} />}
          <svg viewBox={[0, 0, @state.naturalWidth, @state.naturalHeight].join ' '} preserveAspectRatio="none" style={svgStyle}>
            {if currentAnnotation?._toolIndex?
              <rect className="marking-initializer" width="100%" height="100%" fill="transparent" stroke="none" />}
            {for {marks} in currentClassification.annotations when marks?
              <g className="markings"></g>}
          </svg>
        </div>

        <nav className="subject-tools">
          {unless @props.subject.locations.length is 0
            for i in [0...@props.subject.locations.length]
              <button type="button" className="subject-nav-pip" onClick={@handleChangeFrame.bind this, i}>{i}</button>}
        </nav>
      </div>

      <div className="task-area">
        <div className="task-container">
          {if @state.showingSummary
            <div className="classification-summary">
              Thanks!
              {if @props.subject.expert_classification_data?
                <div className="has-expert-classification">
                  {if @state.showingExpertClassification
                    <div>
                      This is the expert classification.
                      <button type="button" onClick={@toggleExpertClassification.bind this, false}>Show mine</button>
                      {for annotation, i in currentClassification.annotations
                        task = @props.workflow.tasks[annotation.task]
                        SummaryComponent = tasks[task.type].Summary
                        <SummaryComponent task={task} annotation={annotation} />}
                    </div>
                  else
                    <div>
                      This subject has an expert classification. You can see how well you’re doing.
                      <button type="button" onClick={@toggleExpertClassification.bind this, true}>Show me</button>
                    </div>}
                </div>}
              {unless @state.showingExpertClassification
                <div>
                  This is your classification:
                  {for annotation, i in currentClassification.annotations
                    task = @props.workflow.tasks[annotation.task]
                    SummaryComponent = tasks[task.type].Summary
                    <SummaryComponent task={task} annotation={annotation} />}
                </div>}
              <div className="talk-stats">
                There are <code>TODO</code> comments on this subject.
              </div>
            </div>

          else if currentTask?
            TaskComponent = tasks[currentTask.type]
            <TaskComponent task={currentTask} annotation={currentAnnotation} onChange={@handleTaskChange} />}
        </div>

        {if @state.showingSummary
          <nav className="task-nav for-summary">
            <a href="#/todo/talk">Talk</a>
            <button type="button" onClick={@props.onClickNext}>Next</button>
          </nav>

        else if currentTask?
          <nav className="task-nav for-classification">
            {firstAnnotation = currentClassification.annotations.indexOf(currentAnnotation) is 0; null}
            <button type="button" disabled={firstAnnotation || null} onClick={currentAnnotation.destroy.bind currentAnnotation}>Back</button>
            {nextTaskKey = currentTask.next or currentTask.type is 'single' and currentTask.answers[currentAnnotation.answer]?.next || null; null}
            {waitingForAnswer = currentTask.type is 'single' and not currentAnnotation.answer?; null}
            {if nextTaskKey?
              nextTaskType = @props.workflow.tasks[nextTaskKey].type
              <button type="button" disabled={waitingForAnswer} onClick={currentClassification.annotate.bind currentClassification, nextTaskType, nextTaskKey}>Next</button>
            else
              <button type="button" disabled={waitingForAnswer} onClick={@completeClassification}>Done</button>}
          </nav>}
      </div>
    </div>

  handleSubjctImageLoad: (e) ->
    {naturalWidth, naturalHeight} = e.target
    unless @state.naturalWidth is naturalWidth and @state.naturalHeight is naturalHeight
      @setState {naturalWidth, naturalHeight}

  handleChangeFrame: (index) ->
    @setState frame: index

  completeClassification: ->
    console?.info 'Completed classification', JSON.stringify @props.classification, null, 2
    @setState showingSummary: true

  toggleExpertClassification: (value) ->
    @setState showingExpertClassification: value
