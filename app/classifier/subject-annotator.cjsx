React = require 'react'
SubjectViewer = require '../components/subject-viewer'
SVG = require '../components/svg'
SVGImage = require '../components/svg-image'
Draggable = require '../lib/draggable'
drawingTools = require './drawing-tools'
tasks = require './tasks'
Tooltip = require '../components/tooltip'
seenThisSession = require '../lib/seen-this-session'
getSubjectLocation = require '../lib/get-subject-location'

NOOP = Function.prototype

module.exports = React.createClass
  displayName: 'SubjectAnnotator'

  getDefaultProps: ->
    project: null
    classification: null
    workflow: null
    annotation: null
    onLoad: NOOP

  getInitialState: ->
    naturalWidth: 0
    naturalHeight: 0
    showWarning: false
    frame: 0
    selectedMark: null
    detailsTooltipOffset: ''
    sizeRect: null
    toolRect: null

  componentDidMount: ->
    addEventListener 'resize', @handleResize
    addEventListener 'scroll', @handleResize
    @setState alreadySeen: @props.subject.already_seen or seenThisSession.check @props.workflow, @props.subject

  componentWillUnmount: ->
    removeEventListener 'resize', @handleResize
    removeEventListener 'scroll', @handleResize

  getScale: ->
    ALMOST_ZERO = 0.01 # Prevent divide-by-zero errors when there is no image.
    rect = @state.sizeRect
    horizontal = (rect?.width || ALMOST_ZERO) / (@state.naturalWidth || ALMOST_ZERO)
    vertical = (rect?.height || ALMOST_ZERO) / (@state.naturalHeight || ALMOST_ZERO)
    {horizontal, vertical}

  getEventOffset: (e) ->
    rect = @refs.sizeRect.getDOMNode().getBoundingClientRect()
    scale = @getScale()
    x = (e.pageX - pageXOffset - rect.left) / scale.horizontal
    y = (e.pageY - pageYOffset - rect.top) / scale.vertical
    {x, y}

  getDetailsTooltipProps: ->
    sizeRect = @state.sizeRect
    toolRect = @state.toolRect

    probablyCentered = 0.15 > Math.abs (sizeRect.left - (innerWidth - sizeRect.right)) / innerWidth
    [start, end, dimension, offsetIndex, attachment, targetAttachment] = if probablyCentered
      ['left', 'right', 'width', 1, 'top center', 'bottom center']
    else
      ['top', 'bottom', 'height', 0, 'middle left', 'middle right']

    # NOTE: These offsets aren't perfect, but they're close enough for now.

    arrowStyle = {}
    toolCenter = ((toolRect[start] + toolRect[end]) / 2) - sizeRect[start]
    distance = toolCenter / sizeRect[dimension]
    arrowStyle[start] = "#{distance * 100}%"

    offset = [0, 0]
    fromCenter = distance - 0.5
    offset[offsetIndex] = "#{(fromCenter / -2) * 100}%"
    offset = offset.join ' '
    {attachment, targetAttachment, offset, arrowStyle}

  componentWillReceiveProps: (nextProps) ->
    @onNewTask nextProps unless nextProps.annotation?.task is @props.annotation?.task
    unless nextProps.annotation is @props.annotation
      @selectMark null, null
    @handleResize()

  componentDidUpdate: ->
    setTimeout (=> @refs.detailsTooltip?.forceUpdate()), 100

  render: ->
    currentTaskDescription = @props.workflow.tasks[@props.annotation?.task]
    currentTaskComponent = tasks[currentTaskDescription?.type]
    {type, format, src} = getSubjectLocation @props.subject, @state.frame

    if currentTaskComponent?
      {BeforeSubject, AfterSubject} = currentTaskComponent
      hookProps =
        task: currentTaskDescription
        classification: @props.classification
        annotation: @props.annotation

    <div className="subject-area">
      {if BeforeSubject?
        <BeforeSubject {...hookProps} />}

      <SubjectViewer user={@props.user} project={@props.project} subject={@props.subject} frame={@state.frame} onLoad={@handleSubjectFrameLoad} onFrameChange={@handleFrameChange}>
        <SVG ref="markingSurface" style={SubjectViewer.overlayStyle} naturalWidth={@state.naturalWidth} naturalHeight={@state.naturalHeight} handleResize={@handleResize}>
          {<SVGImage src={src} width={@state.naturalWidth} height={@state.naturalHeight} /> if type is 'image'}
          <rect ref="sizeRect" width={@state.naturalWidth} height={@state.naturalHeight} fill="rgba(0, 0, 0, 0.01)" fillOpacity="0.01" stroke="none" />

          {if @props.annotation?._toolIndex?
            <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag} onEnd={@handleInitRelease}>
              <rect className="marking-initializer" width={@state.naturalWidth} height={@state.naturalHeight} fill="transparent" stroke="none" />
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
        </SVG>

        {if @state.alreadySeen
          <button type="button" className="warning-banner" onClick={@toggleWarning}>
            Already seen!
            {if @state.showWarning
              <Tooltip attachment="top left" targetAttachment="middle right">
                <p>Our records show that you’ve already seen this image. We might have run out of data for you in this workflow!</p>
                <p>Try choosing a different workflow or contributing to a different project.</p>
              </Tooltip>}
          </button>

        else if @props.subject.retired
          <button type="button" className="warning-banner" onClick={@toggleWarning}>
            Retired!
            {if @state.showWarning
              <Tooltip attachment="top left" targetAttachment="middle right">
                <p>This subject already has enough classifications, so yours won’t be used in its analysis!</p>
                <p>If you’re looking to help, try choosing a different workflow or contributing to a different project.</p>
              </Tooltip>}
          </button>}

        {if @state.toolRect? and @state.selectedMark?
          taskDescription = @props.workflow.tasks[@props.annotation.task]
          toolDescription = taskDescription.tools[@state.selectedMark.tool]
          if toolDescription?.details?.length > 0

            <Tooltip ref="detailsTooltip" {...@getDetailsTooltipProps()}>
              {for detailTask, i in toolDescription.details
                detailTask._key ?= Math.random()
                TaskComponent = tasks[detailTask.type]
                <TaskComponent key={detailTask._key} task={detailTask} annotation={@state.selectedMark.details[i]} onChange={@updateAnnotations} />}
              <div className="actions">
                <button type="button" className="standard-button" disabled={not tasks[taskDescription.type].areMarksComplete(taskDescription, @props.annotation)} onClick={@selectMark.bind this, null, null}>Close</button>
              </div>
            </Tooltip>}
      </SubjectViewer>

      {if AfterSubject?
        <AfterSubject {...hookProps} />}
    </div>

  handleSubjectFrameLoad: (e) ->
    if e.target.tagName.toUpperCase() is 'IMG'
      {naturalWidth, naturalHeight} = e.target
      if @state.naturalWidth is naturalWidth and @state.naturalHeight is naturalHeight
        @handleResize()
      else
        @setState {naturalWidth, naturalHeight}, ->
          @refs.markingSurface.crop()
          @handleResize()
      @props.onLoad? e, @state.frame

  handleFrameChange: (frame) ->
    @setState {frame}

  toggleWarning: ->
    @setState showWarning: not @state.showWarning

  updateAnnotations: ->
    @props.classification.update
      annotations: @props.classification.annotations

  handleResize: ->
    @setState
      sizeRect: @refs.sizeRect.getDOMNode().getBoundingClientRect()
      toolRect: @refs.selectedTool?.getDOMNode().getBoundingClientRect()

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
        frame: @state.frame
      if toolDescription.details?
        mark.details = for detailTaskDescription in toolDescription.details
          tasks[detailTaskDescription.type].getDefaultAnnotation()

      @props.annotation.value.push mark
      @selectMark @props.annotation, mark

      MarkComponent = drawingTools[toolDescription.type]

      if MarkComponent.defaultValues?
        defaultValues = MarkComponent.defaultValues mouseCoords
        for key, value of defaultValues
          mark[key] = value

    if MarkComponent.initStart?
      initValues = MarkComponent.initStart mouseCoords, mark, e
      for key, value of initValues
        mark[key] = value

    setTimeout =>
      @updateAnnotations()

  handleInitDrag: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @state.selectedMark
    MarkComponent = drawingTools[task.tools[mark.tool].type]
    if MarkComponent.initMove?
      mouseCoords = @getEventOffset e
      initMoveValues = MarkComponent.initMove mouseCoords, mark, e
      for key, value of initMoveValues
        mark[key] = value
    @updateAnnotations()

  handleInitRelease: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @state.selectedMark
    MarkComponent = drawingTools[task.tools[mark.tool].type]
    if MarkComponent.initRelease?
      mouseCoords = @getEventOffset e
      initReleaseValues = MarkComponent.initRelease mouseCoords, mark, e
      for key, value of initReleaseValues
        mark[key] = value
    @updateAnnotations()
    if MarkComponent.initValid? and not MarkComponent.initValid mark
      @destroyMark @props.annotation, mark

  selectMark: (annotation, mark) ->
    if annotation? and mark?
      index = annotation.value.indexOf mark
      annotation.value.splice index, 1
      annotation.value.push mark
    @setState selectedMark: mark, =>
      @handleResize() if mark?.details? # hack to show the details box

  destroyMark: (annotation, mark) ->
    if mark is @state.selectedMark
      @setState selectedMark: null
    markIndex = annotation.value.indexOf mark
    annotation.value.splice markIndex, 1
    @updateAnnotations()

  onNewTask: ({annotation}) ->
    
    cropTask = key for key, task of @props.workflow.tasks when task.tools?[0].type is 'crop'
    rectangle = annotation.value[0] for annotation in @props.classification.annotations when annotation.task is cropTask
    
    unless annotation?.task is cropTask
      @refs.markingSurface.crop rectangle.x, rectangle.y, rectangle.width, rectangle.height if rectangle?
    else
      @refs.markingSurface.crop()

