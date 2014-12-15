React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
loadImage = require '../lib/load-image'
Draggable = require '../lib/draggable'
{dispatch} = require '../lib/dispatcher'

drawingComponents =
  point: require './drawing-tools/point'
  ellipse: require './drawing-tools/ellipse'

module.exports = React.createClass
  displayName: 'SubjectViewer'

  getInitialState: ->
    width: 0
    height: 0
    selectedMark: null

  getScale: ->
    ALMOST_ZERO = 0.01 # Prevent divide-by-zero errors when there is no image.
    rect = @refs.subjectContainer?.getDOMNode().getBoundingClientRect()
    rect ?= width: 0, height: 0
    horizontal = rect.width / @state.width || ALMOST_ZERO
    vertical = rect.height / @state.height || ALMOST_ZERO
    {horizontal, vertical}

  getEventOffset: (e) ->
    rect = @refs.subjectContainer.getDOMNode().getBoundingClientRect()
    scale = @getScale()
    x = (e.pageX - pageXOffset - rect.left) / scale.horizontal
    y = (e.pageY - pageYOffset - rect.top) / scale.vertical
    {x, y}

  selectMark: (mark) ->
    index = @props.annotation.marks?.indexOf mark
    if index? and index isnt -1
      @props.annotation.marks.splice index, 1
      @props.annotation.marks.push mark
      @setState selectedMark: mark

  render: ->
    type = Object.keys(@props.subject.locations[0])[0].split('/')[0]
    renderApproprtiately = @["renderType_#{type}"]

    <div className="subject-viewer">
      <div ref="subjectContainer" className="subject-container" style={display: 'inline-block', position: 'relative'}>
        {renderApproprtiately()}
        {@renderMarkingSVG()}
      </div>

      {if @props.subject.locations.length > 1
        <div className="frame-selection">
          {for frame, i in @props.subject.locations
            <button onClick={@handleFrameChange.bind this, i}>{i + 1}</button>}
        </div>}
    </div>

  renderType_image: ->
    frameIndex = @props.classification._frame ? 0
    location = @props.subject.locations[frameIndex]
    knownGood = location['image/jpeg'] ? location['image/png'] ? location['image/gif']
    <img className="subject-image" src={knownGood} onLoad={@handleImageLoad} style={display: 'block'} />

  renderMarkingSVG: ->
    viewBox = [0, 0, @state.width, @state.height]
    svgStyle = height: '100%', left: 0, position: 'absolute', top: 0, width: '100%'

    <svg className="subject-viewer-svg" viewBox={viewBox} preserveAspectRatio="none" data-tool={@props.selectedDrawingTool?.type} style={svgStyle}>
      <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag} onEnd={@handleInitRelease}>
        <rect width={@state.width} height={@state.height} fill="transparent" stroke="none" />
      </Draggable>

      <g className="subject-viewer-tools">{@renderTools()}</g>
    </svg>

  renderTools: ->
    scale = @getScale()

    for annotation in @props.classification.annotations when annotation.marks?
      for mark in annotation.marks
        Tool = drawingComponents[mark._tool.type]
        fromOtherAnnotation = annotation isnt @props.annotation

        toolProps =
          classification: @props.classification
          annotation: annotation
          mark: mark
          scale: scale
          disabled: fromOtherAnnotation
          selected: mark is @state.selectedMark and not fromOtherAnnotation

        toolFunctions =
          select: @selectMark.bind null, mark
          getEventOffset: @getEventOffset

        <Tool key={mark._id} {...toolProps} {...toolFunctions} />

  handleImageLoad: (e) ->
    {width, height} = e.target
    unless @state.width is width and @state.height is height
      @setState {width, height}

  handleFrameChange: (index) ->
    @props.classification.update _frame: index

  handleInitStart: (e) ->
    if @props.selectedDrawingTool?
      mouseCoords = @getEventOffset e

      @props.annotation.marks ?= []

      MarkComponent = drawingComponents[@props.selectedDrawingTool.type]

      if @state.selectedMark? and MarkComponent.isComplete?
        selectedMarkIsIncomplete = not MarkComponent.isComplete @state.selectedMark

      if selectedMarkIsIncomplete
        mark = @state.selectedMark
      else
        mark =
          _id: Math.random()
          _tool: @props.selectedDrawingTool
          _releases: 0

        if MarkComponent.defaultValues?
          defaultValues = MarkComponent.defaultValues mouseCoords
          for key, value of defaultValues
            mark[key] = value

        @props.annotation.marks.push mark
        @setState selectedMark: mark

      if MarkComponent.initStart?
        initValues = MarkComponent.initStart mouseCoords, mark, e
        for key, value of initValues
          mark[key] = value

      @props.classification.emit 'change'

  handleInitDrag: (e) ->
    mouseCoords = @getEventOffset e
    MarkComponent = drawingComponents[@state.selectedMark._tool.type]
    if MarkComponent.initMove?
      initMoveValues = MarkComponent.initMove mouseCoords, @state.selectedMark, e
      for key, value of initMoveValues
        @state.selectedMark[key] = value
      @props.classification.emit 'change'

  handleInitRelease: (e) ->
    mouseCoords = @getEventOffset e
    MarkComponent = drawingComponents[@state.selectedMark._tool.type]
    if MarkComponent.initRelease?
      initReleaseValues = MarkComponent.initRelease mouseCoords, mark, e
      for key, value of initReleaseValues
        @state.selectedMark[key] = value
      @props.classification.emit 'change'
