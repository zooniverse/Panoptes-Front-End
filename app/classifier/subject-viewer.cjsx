# @cjsx React.DOM

React = require 'react'
loadImage = require '../lib/load-image'
Draggable = require '../lib/draggable'
SVGImage = require '../components/svg-image'

drawingComponents =
  point: require './drawing-tools/point'

# TODO: Replace classification prop with just its annotations.

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
          key: mark._key
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

      if mark?.isComplete?() ? true
        MarkClass  = drawingComponents[@props.selectedDrawingTool.type].MarkClass
        mark = new MarkClass mouseCoords
        mark._tool = @props.selectedDrawingTool
        mark._releases = 0
        mark._key = Math.random()

      if mark in @props.classification.annotations
        markIndex = @props.classification.annotations.indexOf mark
        @props.classification.annotations.splice markIndex, 1
      annotation.marks.push mark

      @setState selectedMark: mark

      mark.initStart? mouseCoords, e
      @props.classification.emitChange()

  handleInitDrag: (e) ->
    if @props.selectedDrawingTool?
      mouseCoords = @getEventOffset e
      annotation = @props.classification.annotations[@props.classification.annotations.length - 1]
      mark = annotation.marks[annotation.marks.length - 1]

      mark.initMove? mouseCoords, e
      @props.classification.emitChange()

  handleInitRelease: (e) ->
    if @props.selectedDrawingTool?
      mouseCoords = @getEventOffset e
      annotation = @props.classification.annotations[@props.classification.annotations.length - 1]
      mark = annotation.marks[annotation.marks.length - 1]

      mark.initRelease? mouseCoords, e
      @props.classification.emitChange()
      mark._releases += 1
