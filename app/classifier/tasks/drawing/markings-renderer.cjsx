React = require 'react'
drawingTools = require '../../drawing-tools'

module.exports = React.createClass
  displayName: 'MarkingsRenderer'

  getDefaultProps: ->
    classification: null
    annotation: null
    workflow: null
    scale: null

  getInitialState: ->
    selection: null
    oldSetOfMarks: []

  componentWillReceiveProps: (nextProps) ->
    # console.log 'Old marks were', @state.oldSetOfMarks
    newSetOfMarks = []
    # Automatically select new marks.
    annotations = nextProps.classification?.annotations ? []
    annotation = annotations[annotations.length - 1]
    if annotation?
      taskDescription = @props.workflow?.tasks[annotation.task]
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
    <g>
      {for annotation in @props.classification?.annotations ? []
        annotation._key ?= Math.random()
        isPriorAnnotation = annotation isnt @props.annotation
        taskDescription = @props.workflow.tasks[annotation.task]
        if taskDescription.type is 'drawing'
          <g key={annotation._key} className="marks-for-annotation" data-disabled={isPriorAnnotation || null}>
            {for mark, i in annotation.value when parseInt(mark.frame) is parseInt(@props.frame)
              mark._key ?= Math.random()
              toolDescription = taskDescription.tools[mark.tool]

              toolEnv =
                containerRect: @props.containerRect
                scale: @props.scale
                disabled: isPriorAnnotation
                selected: mark is @state.selection and not isPriorAnnotation
                getEventOffset: @props.getEventOffset

              toolProps =
                classification: @props.classification
                mark: mark
                details: toolDescription.details
                color: toolDescription.color

              toolMethods =
                onChange: @handleChange.bind this, i
                onSelect: @handleSelect.bind this, annotation, mark
                onDeselect: @handleDeselect
                onDestroy: @handleDestroy.bind this, annotation, mark

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
    @props.classification.update 'annotations'

  handleDeselect: ->
    @setState selection: null

  handleDestroy: (annotation, mark) ->
    if mark is @state.selection
      @setState selection: null
    markIndex = annotation.value.indexOf mark
    annotation.value.splice markIndex, 1
    @props.classification.update 'annotations'
