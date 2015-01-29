React = require 'react'
PromiseToSetState = require '../lib/promise-to-set-state'
apiClient = require '../api/client'
SubjectViewer = require './subject-viewer'
AggregateMark = require '../classifier/drawing-tools/aggregate-mark'
ClassificationSummary = require '../classifier/classification-summary'

module.exports = React.createClass
  displayName: 'AggregateView'

  mixins: [PromiseToSetState]

  getDefaultProps: ->
    aggregate: unless process.env.NODE_ENV is 'production'
      require '../api/mock-data/aggregate'

  getInitialState: ->
    classifications: null
    workflow: null
    subject: null
    naturalWidth: 0
    naturalHeight: 0

  componentDidMount: ->
    @fetch @props.aggregate

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.aggregate is @props.aggregate
      @fetch nextProps.aggregate

  fetch: (aggregate) ->
    classifications = aggregate?.link 'classifications'
    @promiseToSetState {classifications}
    classifications.then ([classification]) =>
      @promiseToSetState
        workflow: classification.link 'workflow'
        subject: classification.link 'subject'

  render: ->
    if Object.keys(@state.rejected).length is 0
      <div className="aggregate-viewer">
        {if @state.subject?
          <SubjectViewer subject={@state.subject} onLoad={@handleSubjectLoad}>
            <svg viewBox="0 0 #{@state.naturalWidth} #{@state.naturalHeight}" preserveAspectRatio="none" style={SubjectViewer.overlayStyle}>
              {if @state.workflow?
                for annotation, i in @props.aggregate.annotations
                  task = @state.workflow.tasks[annotation.task]
                  if task.type is 'drawing'
                    <g key={i} className="annotation">
                      {for aggregateMark, i in annotation.value
                        toolDefinition = task.tools[aggregateMark.tool]
                        sourceMarks = for {classification, annotation, mark} in aggregateMark.sources
                          @state.classifications[classification].annotations[annotation].value[mark]
                        <AggregateMark toolDefinition={toolDefinition} mark={aggregateMark} sourceMarks={sourceMarks} />}
                    </g>}
            </svg>
          </SubjectViewer>}

        {if @state.workflow?
          <ClassificationSummary workflow={@state.workflow} classification={@props.aggregate} />}
      </div>

    else
      <div>
        {for key, error of @state.rejected
          <div key={key}>
            <i className="fa fa-excalmation-circle"></i> <code>{error.toString()}</code>
          </div>}
      </div>

  handleSubjectLoad: (e) ->
    if e.target.tagName.toUpperCase() is 'IMG'
      {naturalWidth, naturalHeight} = e.target
      unless @state.naturalWidth is naturalWidth and @state.naturalHeight is naturalHeight
        @setState {naturalWidth, naturalHeight}

  handleFrameChange: (e, index) ->
    @setState frame: parseFloat e.target.dataset.index
