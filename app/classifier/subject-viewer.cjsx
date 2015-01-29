React = require 'react'
SubjectViewer = require '../components/subject-viewer'
Draggable = require '../lib/draggable'
LoadingIndicator = require '../components/loading-indicator'
drawingTools = require './drawing-tools'

module.exports = React.createClass
  displayName: 'SubjectViewer' # TODO: Rename this.

  getInitialState: ->
    naturalWidth: 0
    naturalHeight: 0
    frame: 0

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

  render: ->
    scale = @getScale()

    <div className="subject-area">
      <SubjectViewer subject={@props.subject} frame={@state.frame} onLoad={@handleSubjectLoad} onFrameChange={@handleFrameChange}>
        <svg viewBox={"0 0 #{@state.naturalWidth} #{@state.naturalHeight}"} preserveAspectRatio="none" style={SubjectViewer.overlayStyle}>
          <rect ref="sizeRect" width="100%" height="100%" fill="rgba(0, 0, 0, 0.01)" fillOpacity="0.01" stroke="none" />

          {if @props.annotation?._toolIndex?
            <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag} onEnd={@handleInitRelease}>
              <rect className="marking-initializer" width="100%" height="100%" fill="transparent" stroke="none" />
            </Draggable>}

          {for annotation, i in @props.classification.annotations
            disabled = annotation isnt @props.annotation
            task = @props.workflow.tasks[annotation.task]
            if task.type is 'drawing'
              <g key={i} className="marks-for-annotation" data-disabled={disabled or null}>
                {for mark, i in annotation.value
                  tool = task.tools[mark.tool]

                  toolProps =
                    classification: @props.classification
                    annotation: annotation
                    tool: tool
                    mark: mark
                    scale: scale
                    disabled: disabled
                    selected: not disabled and i is annotation.value.length - 1
                    select: @selectMark.bind this, mark
                    getEventOffset: @getEventOffset

                  ToolComponent = drawingTools[tool.type]
                  <ToolComponent key={Math.random()} {...toolProps} />}
              </g>}
        </svg>

        {if @props.loading
          <div className="is-loading" style={SubjectViewer.overlayCSS}>
            <LoadingIndicator />
          </div>}
      </SubjectViewer>
    </div>

  handleSubjectLoad: (e) ->
    if e.target.tagName.toUpperCase() is 'IMG'
      {naturalWidth, naturalHeight} = e.target
      unless @state.naturalWidth is naturalWidth and @state.naturalHeight is naturalHeight
        @setState {naturalWidth, naturalHeight}

  handleFrameChange: (e, index) ->
    @setState frame: parseFloat e.target.dataset.index

  handleInitStart: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.value[@props.annotation.value.length - 1]

    markIsComplete = true
    if mark?
      MarkComponent = drawingTools[task.tools[mark.tool].type]
      if MarkComponent.isComplete?
        markIsComplete = MarkComponent.isComplete mark

    mouseCoords = @getEventOffset e

    if markIsComplete
      mark =
        tool: @props.annotation._toolIndex
      @props.annotation.value.push mark
      MarkComponent = drawingTools[task.tools[mark.tool].type]

      if MarkComponent.defaultValues?
        defaultValues = MarkComponent.defaultValues mouseCoords
        for key, value of defaultValues
          mark[key] = value

    if MarkComponent.initStart?
      initValues = MarkComponent.initStart mouseCoords, mark, e
      for key, value of initValues
        mark[key] = value

    @props.classification.emit 'change'

  handleInitDrag: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.value[@props.annotation.value.length - 1]
    MarkComponent = drawingTools[task.tools[mark.tool].type]

    mouseCoords = @getEventOffset e

    if MarkComponent.initMove?
      initMoveValues = MarkComponent.initMove mouseCoords, mark, e
      for key, value of initMoveValues
        mark[key] = value
      @props.classification.emit 'change'

  handleInitRelease: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.value[@props.annotation.value.length - 1]
    MarkComponent = drawingTools[task.tools[mark.tool].type]

    mouseCoords = @getEventOffset e

    if MarkComponent.initRelease?
      initReleaseValues = MarkComponent.initRelease mouseCoords, mark, e
      for key, value of initReleaseValues
        mark[key] = value
      @props.classification.emit 'change'

  selectMark: (mark) ->
    index = @props.annotation.value.indexOf mark
    unless index is -1
      @props.annotation.value.splice index, 1
      @props.annotation.value.push mark
