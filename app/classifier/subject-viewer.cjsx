React = require 'react'
loadImage = require '../lib/load-image'
Draggable = require '../lib/draggable'
SVGImage = require '../components/svg-image'
{dispatch} = require '../lib/dispatcher'

drawingComponents =
  point: require './drawing-tools/point'
  ellipse: require './drawing-tools/ellipse'

module.exports = React.createClass
  displayName: 'SubjectViewer'

  getInitialState: ->
    loading: false

    frame: 0
    imageWidth: 0
    imageHeight: 0

    viewX: 0
    viewY: 0
    viewWidth: 0
    viewHeight: 0

    selectedMark: null

  componentDidMount: ->
    @resetSubject @props.subject

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.subject is @props.subject
      @resetSubject nextProps.subject

  resetSubject: (subject) ->
    @setFrame(0).then =>
      @setView 0, 0, @state.imageWidth, @state.imageHeight

  setFrame: (frame) ->
    new Promise (resolve, reject) =>
      @setState loading: true, =>
        loadImage(@props.subject.location[frame]).then (img) =>
          if @isMounted()
            @setState
              loading: false
              frame: frame
              imageWidth: img.width
              imageHeight: img.height
            resolve img

  setView: (viewX, viewY, viewWidth, viewHeight) ->
    @setState {viewX, viewY, viewWidth, viewHeight}

  getScale: ->
    rect = @refs.sizeRect?.getDOMNode().getBoundingClientRect()
    rect ?= width: 0, height: 0
    horizontal: rect.width / @state.viewWidth
    vertical: rect.height / @state.viewHeight

  getEventOffset: (e) ->
    rect = @refs.sizeRect.getDOMNode().getBoundingClientRect()
    {horizontal, vertical} = @getScale()
    x: ((e.pageX - pageXOffset - rect.left) / horizontal) + @state.viewX
    y: ((e.pageY - pageYOffset - rect.top) / vertical) + @state.viewY

  selectMark: (mark) ->
    annotation = @props.classification.annotations[@props.classification.annotations.length - 1]
    index = annotation.marks?.indexOf mark
    if index? and index isnt -1
      annotation.marks.splice index, 1
      annotation.marks.push mark
      @setState selectedMark: mark

  render: ->
    scale = @getScale()

    tools = []
    for {marks}, a in @props.classification.annotations when marks?
      for mark, m in marks
        Tool = drawingComponents[mark._tool.type]
        fromOtherAnnotation = a < @props.classification.annotations.length - 1

        tools.push new Tool
          key: mark._id
          mark: mark
          scale: scale
          disabled: fromOtherAnnotation
          selected: mark is @state.selectedMark and not fromOtherAnnotation
          select: @selectMark.bind null, mark
          getEventOffset: @getEventOffset

    viewBox = [@state.viewX, @state.viewY, @state.viewWidth, @state.viewHeight]

    <svg  className="subject-viewer-svg" width={@state.imageWidth} height={@state.imageHeight} viewBox={viewBox} data-tool={@props.selectedDrawingTool?.type}>
      <rect ref="sizeRect" width={@state.imageWidth} height={@state.imageHeight} />
      <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag} onEnd={@handleInitRelease}>
        <SVGImage src={@props.subject.location?[@state.frame]} width={@state.imageWidth} height={@state.imageHeight} />
      </Draggable>
      <g className="subject-viewer-tools" onMouseDown={@handleToolMouseDown}>{tools}</g>
    </svg>

  handleInitStart: (e) ->
    if @props.selectedDrawingTool?
      mouseCoords = @getEventOffset e
      annotation = @props.classification.annotations[@props.classification.annotations.length - 1]
      annotation.marks ?= []
      mark = annotation.marks[annotation.marks.length - 1]
      MarkComponent = drawingComponents[@props.selectedDrawingTool.type]

      if MarkComponent.isComplete?
        incomplete = not MarkComponent.isComplete? mark

      unless incomplete
        mark =
          _id: Math.random()
          _tool: @props.selectedDrawingTool
          _releases: 0

        if MarkComponent.defaultValues?
          defaultValues = MarkComponent.defaultValues mouseCoords
          for key, value of defaultValues
            mark[key] = value

        dispatch 'classification:annotation:mark:create', @props.classification, annotation, mark

      # TODO: I don't entirely trust that the action always fires immediately.
      # There should probably be a one-time listener here on the classification.

      @setState selectedMark: annotation.marks[annotation.marks.length - 1], =>
        mark = @state.selectedMark
        if MarkComponent.initStart?
          initProps = MarkComponent.initStart mouseCoords, mark, e
          dispatch 'classification:annotation:mark:update', mark, initProps

  handleInitDrag: (e) ->
    if @props.selectedDrawingTool?
      mark = @state.selectedMark
      MarkComponent = drawingComponents[@props.selectedDrawingTool.type]
      mouseCoords = @getEventOffset e

      if MarkComponent.initMove?
        initProps = MarkComponent.initMove mouseCoords, mark, e
        dispatch 'classification:annotation:mark:update', mark, initProps

  handleInitRelease: (e) ->
    if @props.selectedDrawingTool?
      mouseCoords = @getEventOffset e
      annotation = @props.classification.annotations[@props.classification.annotations.length - 1]
      mark = @state.selectedMark
      MarkComponent = drawingComponents[@props.selectedDrawingTool.type]

      dispatch 'classification:annotation:mark:update', mark, _releases: mark._releases + 1
      if MarkComponent.initRelease?
        initProps = MarkComponent.initRelease mouseCoords, mark, e
        dispatch 'classification:annotation:mark:update', mark, initProps
