React = require 'react'
createReactClass = require 'create-react-class'
drawingTools = require '../../drawing-tools'
strategies = require('../../../features/feedback/shared/strategies').default

module.exports = createReactClass
  displayName: 'MarkingsRenderer'

  getDefaultProps: ->
    classification: null
    annotations: []
    annotation: null
    tasks: {}
    workflow: null
    scale: null

  getInitialState: ->
    selection: null
    oldSetOfMarks: []

  componentWillReceiveProps: (nextProps) ->
    # console.log 'Old marks were', @state.oldSetOfMarks
    newSetOfMarks = []
    # Automatically select new marks.
    annotation = nextProps.annotation
    if annotation? && annotation.task?
      taskDescription = @props.tasks[annotation.task]
    if taskDescription?.type is 'drawing' and Array.isArray annotation.value
      for mark in annotation.value
        newSetOfMarks.push mark
        if nextProps.annotation is @props.annotation and mark not in @state.oldSetOfMarks
          # console.log 'New mark!', mark
          @setState selection: mark
    else
      @setState selection: null
    @setState oldSetOfMarks: newSetOfMarks
    # console.log 'Marks are now', newSetOfMarks

  render: ->
    skippedMarks = 0
    <g>
      {for annotation in @props.annotations
        annotation._key ?= Math.random()
        isPriorAnnotation = annotation isnt @props.annotation
        taskDescription = @props.tasks[annotation.task]
        if taskDescription.type is 'drawing'
          <g key={annotation._key} className="marks-for-annotation" data-disabled={isPriorAnnotation || null}>

            {annotation.feedback?.map (item) ->
              key = Math.random()
              FeedbackMark = strategies[item.strategy].FeedbackMark
              <FeedbackMark key={key} rule={item} />
            }

            {for mark, i in annotation.value when @props.workflow?.configuration.multi_image_clone_markers or parseInt(mark.frame) is parseInt(@props.frame)

              mark._key ?= Math.random()

              if skippedMarks < @props.classification._hideMarksBefore and not @props.classification.completed
                skippedMarks += 1
                continue

              if mark._copy?
                continue

              toolDescription = taskDescription.tools[mark.tool]

              if parseInt(mark.frame) is parseInt(@props.frame)
                {details} = toolDescription
              else
                details = null

              if isFinite(@props.scale.horizontal + @props.scale.vertical)
                { scale } = @props
              else
                scale =
                  horizontal: 0.001
                  vertical: 0.001
              toolEnv =
                containerRect: @props.containerRect
                scale: scale
                disabled: isPriorAnnotation
                selected: mark is @state.selection and not isPriorAnnotation
                getEventOffset: @props.getEventOffset
                preferences: @props.preferences

              toolProps =
                taskKey: annotation.task
                classification: @props.classification
                mark: mark
                details: details
                color: toolDescription.color
                size: toolDescription.size

              toolMethods =
                onChange: @handleChange.bind this, i
                onSelect: @handleSelect.bind this, annotation, mark
                onDeselect: @handleDeselect
                onDestroy: @handleDestroy.bind this, annotation, mark
                normalizeDifference: @props.normalizeDifference
                getScreenCurrentTransformationMatrix: @props.getScreenCurrentTransformationMatrix

              ToolComponent = drawingTools[toolDescription.type]
              <ToolComponent key={mark._key} {...toolProps} {...toolEnv} {...toolMethods} />}
          </g>}
    </g>

  handleChange: (markIndex, mark) ->
    @props.annotation.value[markIndex] = mark
    @props.onChange @props.annotation

  handleSelect: (annotation, mark) ->
    @setState selection: mark
    markIndex = annotation.value.indexOf mark
    annotation.value.splice markIndex, 1
    annotation.value.push mark
    @props.onChange annotation

  handleDeselect: ->
    @setState selection: null

  handleDestroy: (annotation, mark) ->
    if mark is @state.selection
      @setState selection: null
    markIndex = annotation.value.indexOf mark
    annotation.value.splice markIndex, 1
    @props.onChange annotation
    if mark.templateID
      index = []
      for cell in annotation.value
        if cell.templateID is mark.templateID
          index.push(annotation.value.indexOf cell)
      annotation.value.splice index[0], index.length
      @props.onChange annotation
