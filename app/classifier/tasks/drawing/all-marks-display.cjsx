React = require 'react'

module.exports = React.createClass
  displayName: 'AllMarksDisplay'

  getDetailsTooltipProps: ->
    workflow: null
    classification: null
    annotation: null

  render: ->
    <g>
      {for annotation in @props.classification.annotations
        annotation._key ?= Math.random()
        isPriorAnnotation = annotation isnt @props.annotation
        taskDescription = @props.workflow.tasks[annotation.task]
        if taskDescription.type is 'drawing'
          <g key={annotation._key} className="marks-for-annotation" data-disabled={isPriorAnnotation or null}>
            {for mark, m in annotation.value
              mark._key ?= Math.random()
              toolDescription = taskDescription.tools[mark.tool]
              toolEnv =
                containerRect: @state.sizeRect
                scale: @getScale()
                disabled: isPriorAnnotation
                selected: mark is @state.selectedMark
                getEventOffset: @getEventOffset
                ref: 'selectedTool' if mark is @state.selectedMark

              toolProps =
                mark: mark
                color: toolDescription.color

              toolMethods =
                onChange: @updateAnnotations
                onSelect: @selectMark.bind this, annotation, mark
                onDestroy: @destroyMark.bind this, annotation, mark

              ToolComponent = drawingTools[toolDescription.type]
              <ToolComponent key={mark._key} {...toolProps} {...toolEnv} {...toolMethods} />}
          </g>}
    </g>
