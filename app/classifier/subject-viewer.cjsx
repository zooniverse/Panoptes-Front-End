# @cjsx React.DOM

React = require 'react'
classificationsStore = require '../data/classifications'
subjectsStore = require '../data/subjects'
loadImage = require '../lib/load-image'
merge = require 'react/lib/merge'
Draggable = require '../lib/draggable'
SVGImage = require '../components/svg-image'

drawingComponents =
  point: require './drawing-tools/point'

module.exports = React.createClass
  displayName: 'SubjectViewer'

  getInitialState: ->
    loading: false
    classification: null
    subject: null
    frame: 0

    imageWidth: 0
    imageHeight: 0

    # NOTE: We'll only change viewX and viewY if we support zoom later.
    viewX: 0
    viewY: 0
    viewWidth: 0
    viewHeight: 0

    selectedMark: null

  componentDidMount: ->
    console.log 'SubjectViewer::componentDidMount'
    @loadClassification @props.classification

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.classification in [@state.classification?.id, @state.loading]
      @loadClassification nextProps.classification

  loadClassification: (id) ->
    console.log 'SubjectViewer::loadClassification'
    @setState loading: id, =>
      console.log 'Loading classification', id
      classificationsStore.get(id).then (classification) =>
        console.log 'Loading subject', classification.subject
        subjectsStore.get(classification.subject).then (subject) =>
          console.log 'Loading image', subject.location[0]
          loadImage(subject.location[0]).then (img) =>
            if @isMounted()
              console.log 'Setting state'
              @setState
                loading: false
                classification: classification
                subject: subject
                frame: 0
                imageWidth: img.width
                imageHeight: img.height
                viewX: 0
                viewY: 0
                viewWidth: img.width
                viewHeight: img.height
                -> console.log 'Done'

  setFrame: (frame) ->
    @setState frame: frame, =>
      loadImage(@state.subject.location[frame]).then (img) =>
        if @isMounted()
          @setState
            loading: false
            imageWidth: img.width
            imageHeight: img.height

  getScale: ->
    rect = @refs.svg?.getDOMNode().getBoundingClientRect()
    rect ?= width: 0, height: 0
    horizontal: rect.width / @state.viewWidth
    vertical: rect.height / @state.viewHeight

  getEventOffset: (e) ->
    rect = @refs.svg.getDOMNode().getBoundingClientRect()
    {horizontal, vertical} = @getScale()
    x: ((e.pageX - pageXOffset - rect.left) / horizontal) + @state.viewX
    y: ((e.pageY - pageYOffset - rect.top) / vertical) + @state.viewY

  selectMark: (mark) ->
    annotation = @state.classification.annotations[@state.classification.annotations.length - 1]
    index = annotation.marks?.indexOf mark
    if index? and index isnt -1
      annotation.marks.splice index, 1
      annotation.marks.push mark
      @setState selectedMark: mark

  render: ->
    if @state.classification? and @state.subject?
      viewBox = [@state.viewX, @state.viewY, @state.viewWidth ? 0, @state.viewHeight ? 0]

      scale = @getScale()

      tools = []
      for {marks}, a in @state.classification.annotations when marks?
        for mark, m in marks
          Tool = drawingComponents[mark._tool.type]
          fromOtherAnnotation = a < @state.classification.annotations.length - 1

          tools.push new Tool
            key: mark._key
            mark: mark
            scale: scale
            disabled: fromOtherAnnotation
            selected: mark is @state.selectedMark and not fromOtherAnnotation
            select: @selectMark.bind null, mark
            getEventOffset: @getEventOffset

      <svg ref="svg" className="subject-viewer-svg" viewBox={viewBox} data-tool={@props.selectedDrawingTool?.type}>
        <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag} onEnd={@handleInitRelease}>
          <SVGImage src={@state.subject.location[@state.frame]} width={@state.imageWidth} height={@state.imageHeight} />
        </Draggable>

        <Draggable onDrag={@handleToolMove}>
          <g className="subject-viewer-tools" onMouseDown={@handleToolMouseDown}>{tools}</g>
        </Draggable>
      </svg>

    else
      <p>Loading subject viewer</p>

  handleInitStart: (e) ->
    if @props.selectedDrawingTool?
      mouseCoords = @getEventOffset e
      annotation = @state.classification.annotations[@state.classification.annotations.length - 1]
      annotation.marks ?= []
      mark = annotation.marks[annotation.marks.length - 1]

      if mark?.isComplete?() ? true
        MarkClass  = drawingComponents[@props.selectedDrawingTool.type].MarkClass
        mark = new MarkClass mouseCoords
        mark._tool = @props.selectedDrawingTool
        mark._releases = 0
        mark._key = Math.random()

      if mark in @state.classification.annotations
        markIndex = @state.classification.annotations.indexOf mark
        @state.classification.annotations.splice markIndex, 1
      annotation.marks.push mark

      @setState selectedMark: mark

      @state.classification.apply =>
        mark.initStart? mouseCoords, e

  handleInitDrag: (e) ->
    if @props.selectedDrawingTool?
      mouseCoords = @getEventOffset e
      annotation = @state.classification.annotations[@state.classification.annotations.length - 1]
      mark = annotation.marks[annotation.marks.length - 1]

      @state.classification.apply =>
        mark.initMove? mouseCoords, e

  handleInitRelease: (e) ->
    if @props.selectedDrawingTool?
      mouseCoords = @getEventOffset e
      annotation = @state.classification.annotations[@state.classification.annotations.length - 1]
      mark = annotation.marks[annotation.marks.length - 1]

      @state.classification.apply =>
        mark.initRelease? mouseCoords, e
        mark._releases += 1

  handleToolMove: ->
    @forceUpdate()
