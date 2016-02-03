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
    classifications = aggregate?.get 'classifications'
    @promiseToSetState {classifications}
    classifications.then ([classification]) =>
      @promiseToSetState
        workflow: classification.get 'workflow'
        subject: classification.get 'subject'

  render: ->
    if Object.keys(@state.rejected).length is 0
      <div className="aggregate-viewer">
        {if @state.subject?
          <SubjectViewer subject={@state.subject} onLoad={@handleSubjectLoad}>
            <svg viewBox="0 0 #{@state.naturalWidth} #{@state.naturalHeight}" preserveAspectRatio="none" style={SubjectViewer.overlayStyle}>
              {if @state.workflow?
                for annotation in @props.aggregate.annotations
                  annotation._key ?= Math.random()
                  task = @state.workflow.tasks[annotation.task]
                  if task.type is 'drawing'
                    <g key={annotation._key} className="marks-for-annotation">
                      {for aggregateMark in annotation.value
                        aggregateMark._key ?= Math.random()
                        toolDefinition = task.tools[aggregateMark.tool]
                        sourceMarks = for {classification, annotation, mark} in aggregateMark.sources
                          @state.classifications[classification].annotations[annotation].value[mark]
                        <AggregateMark key={aggregateMark._key} toolDefinition={toolDefinition} mark={aggregateMark} sourceMarks={sourceMarks} />}
                    </g>}
            </svg>
          </SubjectViewer>}

        {if @state.workflow?
          <div>
            Aggregate classification:
            <ClassificationSummary workflow={@state.workflow} classification={@props.aggregate} />
          </div>}

        <br />
        <br />

        {if @state.workflow?
          for classification in @state.classifications
            <div key={classification.id}>
              Classification <code>{classification.id}</code>
              <ClassificationSummary workflow={@state.workflow} classification={classification} />
            </div>}


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
