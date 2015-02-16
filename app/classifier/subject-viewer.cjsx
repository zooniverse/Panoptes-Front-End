React = require 'react'
SubjectViewer = require '../components/subject-viewer'
Draggable = require '../lib/draggable'
drawingTools = require './drawing-tools'
tasks = require './tasks'
Tooltip = require '../components/tooltip'

NOOP = Function.prototype

module.exports = React.createClass
  displayName: 'SubjectViewer' # TODO: Rename this.

  getDefaultProps: ->
    classification: null
    workflow: null
    annotation: null
    onLoad: NOOP

  getInitialState: ->
    naturalWidth: 0
    naturalHeight: 0
    frame: 0
    selectedMark: null

  getScale: ->
    ALMOST_ZERO = 0.01 # Prevent divide-by-zero errors when there is no image.
    rect = @refs.sizeRect?.getDOMNode().getBoundingClientRect()
    horizontal = (rect?.width || ALMOST_ZERO) / (@state.naturalWidth || ALMOST_ZERO)
    vertical = (rect?.height || ALMOST_ZERO) / (@state.naturalHeight || ALMOST_ZERO)
    {horizontal, vertical}

  getEventOffset: (e) ->
    rect = @refs.sizeRect.getDOMNode().getBoundingClientRect()
    scale = @getScale()
    x = (e.pageX - pageXOffset - rect.left) / scale.horizontal
    y = (e.pageY - pageYOffset - rect.top) / scale.vertical
    {x, y}

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.annotation is @props.annotation
      @selectMark null, null

  render: ->
    scale = @getScale()

    updateAnnotations = =>
      @props.classification.update
        annotations: @props.classification.annotations

    <div className="subject-area">
      <SubjectViewer subject={@props.subject} frame={@state.frame} onLoad={@handleSubjectFrameLoad} onFrameChange={@handleFrameChange}>
        <svg viewBox={"0 0 #{@state.naturalWidth} #{@state.naturalHeight}"} preserveAspectRatio="none" style={SubjectViewer.overlayStyle}>
          <rect ref="sizeRect" width="100%" height="100%" fill="rgba(0, 0, 0, 0.01)" fillOpacity="0.01" stroke="none" />

          {if @props.annotation?._toolIndex?
            <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag} onEnd={@handleInitRelease}>
              <rect className="marking-initializer" width="100%" height="100%" fill="transparent" stroke="none" />
            </Draggable>}

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
                    scale: scale
                    disabled: isPriorAnnotation
                    selected: mark is @state.selectedMark
                    getEventOffset: @getEventOffset

                  toolProps =
                    mark: mark
                    color: toolDescription.color

                  toolMethods =
                    onChange: updateAnnotations
                    onSelect: @selectMark.bind this, annotation, mark
                    onDestroy: @destroyMark.bind this, annotation, mark

                  ToolComponent = drawingTools[toolDescription.type]
                  <ToolComponent key={mark._key} {...toolProps} {...toolEnv} {...toolMethods} />}
              </g>}
        </svg>

        {if @props.workflow.tasks[@props.annotation?.task]?.type is 'drawing' and @state.selectedMark in @props.annotation.value
          tool = @props.workflow.tasks[@props.annotation.task].tools[@state.selectedMark.tool]
          if tool?.details?
            <Tooltip at="middle right" from="middle left">
              {for detailTask, i in tool.details
                detailTask._key ?= Math.random()
                TaskComponent = tasks[detailTask.type]
                <TaskComponent key={detailTask._key} task={detailTask} annotation={@state.selectedMark.details[i]} onChange={updateAnnotations} />}
              <div className="actions">
                <button type="button" className="standard-button" onClick={@selectMark.bind this, null, null}>Close</button>
              </div>
            </Tooltip>}
      </SubjectViewer>
    </div>

  handleSubjectFrameLoad: (e) ->
    if e.target.tagName.toUpperCase() is 'IMG'
      {naturalWidth, naturalHeight} = e.target
      unless @state.naturalWidth is naturalWidth and @state.naturalHeight is naturalHeight
        @setState {naturalWidth, naturalHeight}
      @props.onLoad? arguments...

  handleFrameChange: (e) ->
    @setState frame: parseFloat e.target.value

  handleInitStart: (e) ->
    taskDescription = @props.workflow.tasks[@props.annotation.task]
    mark = @state.selectedMark

    markIsComplete = true
    if mark?
      toolDescription = taskDescription.tools[mark.tool]
      MarkComponent = drawingTools[toolDescription.type]
      if MarkComponent.isComplete?
        markIsComplete = MarkComponent.isComplete mark

    mouseCoords = @getEventOffset e

    if markIsComplete
      toolDescription = taskDescription.tools[@props.annotation._toolIndex]
      mark =
        tool: @props.annotation._toolIndex
      if toolDescription.details?
        mark.details = for detailTaskDescription in toolDescription.details
          tasks[detailTaskDescription.type].getDefaultAnnotation()

      @props.annotation.value.push mark
      @selectMark @props.annotation, mark
      MarkComponent = drawingTools[taskDescription.tools[mark.tool].type]

      if MarkComponent.defaultValues?
        defaultValues = MarkComponent.defaultValues mouseCoords
        for key, value of defaultValues
          mark[key] = value

    if MarkComponent.initStart?
      initValues = MarkComponent.initStart mouseCoords, mark, e
      for key, value of initValues
        mark[key] = value

    @props.classification.update 'annotations'

  handleInitDrag: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.value[@props.annotation.value.length - 1]
    MarkComponent = drawingTools[task.tools[mark.tool].type]

    mouseCoords = @getEventOffset e

    if MarkComponent.initMove?
      initMoveValues = MarkComponent.initMove mouseCoords, mark, e
      for key, value of initMoveValues
        mark[key] = value
      @props.classification.update 'annotations'

  handleInitRelease: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.value[@props.annotation.value.length - 1]
    MarkComponent = drawingTools[task.tools[mark.tool].type]

    mouseCoords = @getEventOffset e

    if MarkComponent.initRelease?
      initReleaseValues = MarkComponent.initRelease mouseCoords, mark, e
      for key, value of initReleaseValues
        mark[key] = value
      @props.classification.update 'annotations'

  selectMark: (annotation, mark) ->
    if annotation? and mark?
      index = annotation.value.indexOf mark
      unless index is -1
        annotation.value.splice index, 1
        annotation.value.push mark
    @setState selectedMark: mark

  destroyMark: (annotation, mark) ->
    markIndex = annotation.value.indexOf mark
    annotation.value.splice markIndex, 1
    @props.classification.update 'annotations'
