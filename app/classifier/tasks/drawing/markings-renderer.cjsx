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
                selected: mark is annotation.value[annotation.value.length - 1] and not isPriorAnnotation
                getEventOffset: @props.getEventOffset

              toolProps =
                mark: mark
                details: toolDescription.details
                color: toolDescription.color

              toolMethods =
                onChange: @props.classification.update.bind @props.classification, 'annotations'
                onSelect: @handleSelect.bind this, annotation, mark
                onDestroy: @handleDestroy.bind this, annotation, mark

              ToolComponent = drawingTools[toolDescription.type]
              <ToolComponent key={mark._key} {...toolProps} {...toolEnv} {...toolMethods} />}
          </g>}
    </g>

  handleSelect: (annotation, mark) ->
    @setState selection: mark
    markIndex = annotation.value.indexOf mark
    annotation.value.splice markIndex, 1
    annotation.value.push mark
    @props.classification.update 'annotations'

  handleDestroy: (annotation, mark) ->
    if mark is @state.selection
      @setState selection: null
    markIndex = annotation.value.indexOf mark
    annotation.value.splice markIndex, 1
    @props.classification.update 'annotations'
