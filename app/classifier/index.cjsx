React = require 'react'
Draggable = require '../lib/draggable'
tasks = require './tasks'
drawingTools = require './drawing-tools'

unless process.env.NODE_ENV is 'production'
  mockData = require './mock-data'

DEFAULT_RENDER_METHOD = ->
  <span>{@type.displayName}</span>

READABLE_FORMATS =
  image: ['jpg', 'png', 'svg+xml', 'gif']

module.exports = React.createClass
  displayName: 'Classifier'

  getDefaultProps: ->
    if process.env.NODE_ENV is 'production'
      workflow: null
      subject: null
      classification: null
    else
      mockData

  getInitialState: ->
    frame: 0
    currentToolIndex: 0
    showingSummary: false
    showingExpertClassification: false

  render: ->
    currentClassification = if @state.showingExpertClassification
      @props.subject.expert_classification_data
    else
      @props.classification

    currentAnnotation = currentClassification.annotations[currentClassification.annotations.length - 1]
    currentTask = @props.workflow.tasks[currentAnnotation.task]

    for mimeType, src of @props.subject.locations[@state.frame]
      [subjectType, format] = mimeType.split '/'
      if subjectType of READABLE_FORMATS and format in READABLE_FORMATS[subjectType]
        subjectSrc = src
        break

    <div>
      <div className="subject-area">
        <div className="subject-container">
          {switch subjectType
            when 'image' then <img className="subject" alt="Subject #{@props.subject.id}" src={subjectSrc} />}
          <svg>
            {if @state.currentTool? and not @state.showingSummary
              <rect />}
            {for {marks} in currentClassification.annotations when marks?
              <g></g>}
          </svg>
        </div>

        <nav>
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
                  {if @showingExpertClassification
                    <div>This is the expert classification.</div>
                  else
                    <div>
                      This subject has an expert classification. You can see how well you’re doing.
                      <button type="button">Show me the expert classification</button>
                    </div>}
                </div>}
              <div class="talk-stats">
                There are no comments on this subject. Be the first!
              </div>
            </div>
          else
            TaskComponent = tasks[currentTask.type]
            <TaskComponent task={currentTask} currentTool={@state.currentTool} onChange={@handleTaskChange} />}
        </div>

        {if @state.showingSummary
          <nav className="for-summary">
            <a href="#/todo/talk">Talk</a>
            <button type="button">Next</button>
          </nav>

        else
          <nav className="for-tasks">
            {firstAnnotation = currentClassification.annotations.indexOf(currentAnnotation) is 0; null}
            <button type="button" disabled={firstAnnotation || null}>Back</button>

            {nextTask = currentTask.next or currentTask.type is 'single' and currentTask.answers[currentAnnotation.answer].next; null}
            {if nextTask
              <button type="button">Next</button>
            else
              <button type="button">Done</button>}
          </nav>}
      </div>
    </div>

  handleChangeFrame: (index) ->
    @setState frame: index

  handleTaskChange: (data) ->
