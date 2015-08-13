React = require 'react'
drawingTools = require '../../drawing-tools'

module.exports = React.createClass
  displayName: 'MarkingsRenderer'

  getDefaultProps: ->
    classification: null
    annotation: null
    workflow: null
    scale: null

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
                # selected: mark is @state.selectedMark
                getEventOffset: @getEventOffset
                # ref: 'selectedTool' if mark is @state.selectedMark

              toolProps =
                mark: mark
                color: toolDescription.color

              toolMethods =
                onChange: @props.classification.update.bind @props.classification, 'annotations'
                onSelect: Function.prototype # @selectMark.bind this, annotation, mark
                onDestroy: Function.prototype # @destroyMark.bind this, annotation, mark

              ToolComponent = drawingTools[toolDescription.type]
              <ToolComponent key={mark._key} {...toolProps} {...toolEnv} {...toolMethods} />}
          </g>}

    </g>
