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
    # Automatically select new marks.
    newSetOfMarks = []
    annotations = nextProps.classification?.annotations ? []
    annotation = annotations[annotations.length - 1]
    taskDescription = @props.workflow?.tasks[annotation.task]
    if taskDescription?.type is 'drawing' and Array.isArray annotation.value
      for mark in annotation.value
        newSetOfMarks.push mark
        if mark not in @state.oldSetOfMarks
          @setState selection: mark
    @setState oldSetOfMarks: newSetOfMarks

  render: ->
    <g>
      {for annotation in @props.classification?.annotations ? []
        annotation._key ?= Math.random()
        isPriorAnnotation = annotation isnt @props.annotation
        taskDescription = @props.workflow.tasks[annotation.task]
        if taskDescription.type is 'drawing'
          <g key={annotation._key} className="marks-for-annotation" data-disabled={isPriorAnnotation || null}>
            {for mark in annotation.value
              mark._key ?= Math.random()
              toolDescription = taskDescription.tools[mark.tool]

              toolEnv =
                containerRect: {} # TODO
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
                onChange: @handleChange
                onSelect: @handleSelect.bind this, annotation, mark
                onDeselect: @handleDeselect
                onDestroy: @handleDestroy.bind this, annotation, mark

              ToolComponent = drawingTools[toolDescription.type]
              <ToolComponent key={mark._key} {...toolProps} {...toolEnv} {...toolMethods} />}
          </g>}
    </g>

  handleChange: ->
    @props.classification.update 'annotations'

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
