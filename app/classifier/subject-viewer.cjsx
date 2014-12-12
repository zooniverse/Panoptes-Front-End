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
    frame: 0
    width: 0
    height: 0

    selectedMark: null

  # setFrame: (frame) ->
  #   new Promise (resolve, reject) =>
  #     location = @props.subject.locations[frame]
  #     src = location['image/jpeg'] ? location['image/png'] ? location['image/gif']
  #     loadImage(src).then (img) =>
  #       if @isMounted()
  #         @setState
  #           frame: frame
  #           width: img.width
  #           height: img.height
  #         resolve img

  getScale: ->
    rect = @refs.subjectContainer?.getDOMNode().getBoundingClientRect()
    rect ?= width: 0, height: 0
    horizontal = rect.width / @state.width || 0.01
    vertical = rect.height / @state.height || 0.01
    {horizontal, vertical}

  getEventOffset: (e) ->
    rect = @refs.subjectContainer.getDOMNode().getBoundingClientRect()
    scale = @getScale()
    x = (e.pageX - pageXOffset - rect.left) / scale.horizontal
    y = (e.pageY - pageYOffset - rect.top) / scale.vertical
    {x,y}

  selectMark: (mark) ->
    annotation = @props.classification.annotations[@props.classification.annotations.length - 1]
    index = annotation.marks?.indexOf mark
    if index? and index isnt -1
      annotation.marks.splice index, 1
      annotation.marks.push mark
      @setState selectedMark: mark

  render: ->
    type = (mime for mime of @props.subject.locations[0])[0].split('/')[0]

    <div className="subject-viewer">
      <div ref="subjectContainer" className="subject-container" style={display: 'inline-block', position: 'relative'}>
        {@["renderType_#{type}"]()}
        {@renderMarkingSVG()}
      </div>
    </div>

  renderType_image: ->
    WHICH_LOCATION = 0 # Temporary

    location = @props.subject.locations[WHICH_LOCATION]

    knownGood = location['image/jpeg'] ? location['image/png'] ? location['image/gif']
    knownGood = knownGood.replace(/anoptes/, 'panoptes')

    viewBox = [@state.viewX, @state.viewY, @state.viewWidth, @state.viewHeight]

    <img src={knownGood} onLoad={@handleImageLoad} style={display: 'block'} />

  handleImageLoad: (e) ->
    console.log 'Subject image loaded, setting width and height'
    @setState
      width: e.target.width
      height: e.target.height

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
    @props.classification.annotations[0].marks ?= [
      {_id: '0', _tool: {type: 'point'}, x: 20, y: 20}
      # {_id: '1', _tool: {type: 'ellipse'}, x: 100, y: 100, rx: 20, ry: 40, angle: 10}
    ] # Demo

    tools = []
    for annotation, a in @props.classification.annotations when annotation.marks?
      for mark, m in annotation.marks
        Tool = drawingComponents[mark._tool.type]
        fromOtherAnnotation = a < @props.classification.annotations.length - 1

        props =
          classification: @props.classification
          annotation: annotation
          mark: mark
          scale: scale
          disabled: fromOtherAnnotation
          selected: mark is @state.selectedMark and not fromOtherAnnotation
          select: @selectMark.bind null, mark
          getEventOffset: @getEventOffset

        tools.push <Tool key={mark._id} {...props} />

    tools

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
